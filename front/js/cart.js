// recuprération de tout les produits de l'API
let Products = async () => fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(function (data) {

        return data
    });

function getStorage() {
    // recupération du local storage
    return JSON.parse(localStorage.getItem('product'))
}

function createCartItems() {

    let currentStorage = getStorage();

    currentStorage.forEach(element => { createArticleItem(element); });
    productsPrice(currentStorage);

}

// calcul du total des prix 
async function productsPrice(products) {

    let totalPrice = 0;
    let totalQuantity = 0;

    for (let i = 0; i < products.length; i++) {

        let elt = await checkProduct(products[i]);

        totalPrice += products[i].quantity * elt.price;
        totalQuantity += products[i].quantity;
    }

    document.getElementById('totalPrice').innerText = totalPrice;
    document.getElementById('totalQuantity').innerText = totalQuantity;

}

async function checkProduct(element) {

    let allProducts = await Products();
    let elementChecked = [];
    allProducts.forEach(elt => {

        if (element._id == elt['_id']) {

            elementChecked = elt;
        }

    });
    return elementChecked;
}

async function createArticleItem(element) {

    let elt = await checkProduct(element);

    const cart__item = document.getElementById('cart__items');
    let article = document.createElement('article');

    cart__item.appendChild(article);

    article.classList.add('cart__item');
    article.setAttribute('data-id', element._id);
    article.setAttribute('data-color', element.color);

    let image = document.createElement('div');
    image.classList.add('cart__item__img');
    image.innerHTML = `<img src="`
        + elt.imageUrl + `" alt="`
        + elt.altTxt + `">`;

    article.appendChild(image);

    let content = document.createElement('div');
    content.classList.add('cart__item__content');
    let description = document.createElement('div');
    description.classList.add("cart__item__content__description");

    let name = document.createElement('h2')
    name.innerText = elt.name;
    description.appendChild(name);

    let color = document.createElement('p');
    color.innerHTML = element.color;
    description.appendChild(color);

    let price = document.createElement('p');
    price.innerHTML = elt.price + `,00 €`;
    description.appendChild(price);

    content.appendChild(description);

    article.appendChild(content);

    let contentSetting = document.createElement('div');
    contentSetting.classList.add('cart__item__content__settings');
    contentSetting.innerHTML = `<div class="cart__item__content__settings__quantity">
    <p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="`+ element.quantity + `">
      </div>`;

    article.appendChild(contentSetting);

    let del = document.createElement('div');
    del.classList.add('cart__item__content__settings__delete');
    del.innerHTML = `<p class="deleteItem"> Supprimer</p>`;

    article.appendChild(del);



}

// ***********Validateur prénom/nom***********
function namesValidation(inputName) {

    let errorMessage = inputName.nextElementSibling;
    let name = inputName.previousElementSibling.innerText.toLowerCase().slice(0, -1);


    if (inputName.value.length < 1) {

        errorMessage.innerText = `Le ` + name + ` que vous indiqué doit contenir au moin 1 caractère.`;
        return false;

    }
    else if (inputName.value.length > 50) {

        errorMessage.innerText = `Le ` + name + ` que vous indiqué doit contenir moin de 50 caractères.`;
        return false;

    }
    else if (/^[\-]/.test(inputName.value)) {
        errorMessage.innerText = `Le ` + name + ` que vous indiqué ne doit pas commencer par un caractère spécial.`;
        return false;

    }
    else if (/[\-]$/.test(inputName.value)) {
        errorMessage.innerText = `Le ` + name + ` que vous indiqué ne doit pas se finir par un caractère spécial.`;
        return false;

    }

    else if (/[0-9]/.test(inputName.value)) {

        errorMessage.innerText = `Le ` + name + ` que vous indiqué ne doit pas contenir de chiffre.`;
        return false;

    }
    else if (/[\.]/.test(inputName.value)) {
        errorMessage.innerText = `Le ` + name + ` indiqué contient un caractère qui n'est pas supporté.`;
        return false;
    }
    else if (inputName.value.replace(/[a-zA-Z\à\â\ä\é\è\ê\ë\ï\î\ô\ö\ù\û\ü\ÿ\ç\'\-]/gi, '') != '') {
        errorMessage.innerText = `Le ` + name + ` indiqué contient un caractère qui n'est pas supporté.`;
        return false;

    }
    else {

        errorMessage.innerText = ``;
        return true;

    }

}
// ***********fin du Validateur prénom/nom***********

// ***********Validateur address***********
function addressValidation(inputAddress) {

    let errorMessage = inputAddress.nextElementSibling;
    let address = inputAddress.previousElementSibling.innerText.toLowerCase().slice(0, -1);

    if (inputAddress.value.replace(/[a-zA-Z0-9\à\â\ä\é\è\ê\ë\ï\î\ô\ö\ù\û\ü\ÿ\ç\'\-\ ]/gi, '') == '') {

        if (inputAddress.value.length < 1) {
            if (address == 'ville') {

                errorMessage.innerText = `La ` + address + ` que vous indiqué doit contenir au moin 1 caractère.`;

            }
            else {

                errorMessage.innerText = `L'` + address + ` que vous indiqué doit contenir au moin 1 caractère.`;

            }
            return false;

        }
        else if (inputAddress.value.length > 50) {

            if (address == 'ville') {

                errorMessage.innerText = `La ` + address + ` que vous indiqué doit contenir moin de 50 caractère.`;

            }
            else {

                errorMessage.innerText = `L'` + address + ` que vous indiqué doit contenir moin de 50 caractère.`;

            }
            return false;

        }

        errorMessage.innerText = ''
        return true;

    }
    else {

        if (address == 'ville') {

            errorMessage.innerText = `La ` + address + ` que vous indiqué n'est pas prise en compte.`;

        }
        else {

            errorMessage.innerText = `L'` + address + ` que vous indiqué n'est pas prise en compte.`;

        }
        return false;

    }
}
// ***********fin du Validateur address***********

// ***********Validateur email***********
function emailValidation(inputEmail) {

    let RegexExp = new RegExp('[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})');
    let errorMessage = inputEmail.nextElementSibling;

    if (RegexExp.test(inputEmail.value)) {
        errorMessage.innerText = ''
        return true;

    }
    else {

        errorMessage.innerText = `L'adresse Email que vous avez indiqué n'est pas valide`;
        return false;

    }


}
// ***********Fin du Validateur email***********

// ***********fonction send***********
function send(contact, products) {

    fetch('http://localhost:3000/api/products/order', {
        
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contact: contact, products: products })

    })
        .then(function (res) {

            if (res.ok) {

                return res.json();
            }
        })
        .then(function (data) {
            
            location.href = 'http://127.0.0.1:5500/front/html/confirmation.html?orderId=' + data.orderId;
            localStorage.clear();
        })

}

// ***********Fin de la fonction send***********


function modifyOrder() {

    const deleteBtn = document.querySelectorAll('.deleteItem');
    const inputNumber = document.querySelectorAll('.itemQuantity');
    const article = document.querySelectorAll('.cart__item');
    const section = document.getElementById('cart__items');

    for (let i = 0; i < deleteBtn.length; i++) {

        deleteBtn[i].addEventListener('click', function (event) {

            let articlesSelected = getStorage();
            const targetElement = event.target.closest('.cart__item').dataset;
            let indexArticle = articlesSelected.findIndex((element) => element._id == targetElement.id && element.color == targetElement.color);

            section.removeChild(article[i]);
            articlesSelected.splice(indexArticle, 1);

            localStorage.setItem('product', JSON.stringify(articlesSelected));
            productsPrice(articlesSelected);

        })
    }


    for (let i = 0; i < inputNumber.length; i++) {

        inputNumber[i].addEventListener('change', function (event) {

            let articlesSelected = getStorage();

            const targetElement = event.target.closest('.cart__item').dataset;
            let indexArticle = articlesSelected.findIndex((element) => element._id == targetElement.id && element.color == targetElement.color);

            articlesSelected[indexArticle].quantity = +event.target.value;

            localStorage.setItem('product', JSON.stringify(articlesSelected));
            productsPrice(articlesSelected);

        })
    }
}

Products()
    .then(createCartItems())
    .then(setTimeout(modifyOrder, 500));

let form = document.querySelector('form');

form.firstName.addEventListener('change', function () {
    // Ecoute des modifications de firstName

    namesValidation(this);

})

form.lastName.addEventListener('change', function () {
    // Ecoute des modifications de lastName

    namesValidation(this);

})

form.address.addEventListener('change', function () {
    // Ecoute des modifications de #address

    addressValidation(this);

})

form.city.addEventListener('change', function () {
    // Ecoute des modifications de #city

    addressValidation(this);

})

form.email.addEventListener('change', function () {
    // Ecoute des modifications de #email

    emailValidation(this);

})
function order() {

    let contact = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value
    };

    let products = []

    getStorage().forEach(element => {

        products.push(element._id)

    });

    send(contact, products);

}

form.addEventListener('submit', function (event) {

    event.preventDefault();

    if (emailValidation(form.email) && addressValidation(form.address) && addressValidation(form.city) && namesValidation(form.firstName) && namesValidation(form.lastName)) {

        order();
    }
})