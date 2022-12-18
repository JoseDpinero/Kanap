let form = document.querySelector('form');

// recupération de tous les produits de l'API.
let getProducts = async () => fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(function (data) {
        return data
    });

// recupération du local storage.
function getStorage() {
    return JSON.parse(localStorage.getItem('product'))
}

// Si le Produit est dans l'API créé l'article sinon supprime l'entrée.
async function getLocalStorage() {
    let currentStorage = await getStorage();
    let i = 0;

    if (currentStorage != null && currentStorage.length != 0) {
        currentStorage.forEach(async element => {
            let result = await checkProduct(element, currentStorage);

            if (result) {
                createArticleItem(element);
                productsPrice(currentStorage);
            } else {
                currentStorage.splice(i, 1);
                localStorage.setItem('product', JSON.stringify(currentStorage));
            }
            i++
        });
    }
}

// Fait le total des prix des produits sélectionnés et l'injecte dans le #totalPrice et #totalQuantity.
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

// Vérifie que le produit est dans l'API 
async function checkProduct(element) {
    let allProducts = await getProducts();
    let currentItem = element;
    let indexArticle = allProducts.findIndex((element) => element._id == currentItem._id);

    if (indexArticle != -1) {
        return allProducts[indexArticle];
    } else {
        return false;
    }
}

// Créé un article 
async function createArticleItem(element) {
    let elt = await checkProduct(element);

    const cart__item = document.getElementById('cart__items');
    cart__item.innerHTML += `<article class="cart__item" data-id="${element._id}" data-color="${element.color}">
<div class="cart__item__img">
<img src="${elt.imageUrl}" alt="${elt.altTxt}">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>${elt.name}</h2>
    <p>${element.color}</p>
    <p>${elt.price},00 €</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${element.quantity}">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem">Supprimer</p>
    </div>
  </div>
</div>`;
}

// Supprime le produit.
function deleteItem(deleteBtn, article, section) {
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
}


// Modifie la quantité d'un produit.
function modifyQuantity(number) {
    for (let i = 0; i < number.length; i++) {
        number[i].addEventListener('change', function (event) {
            let articlesSelected = getStorage();

            const targetElement = event.target.closest('.cart__item').dataset;
            let indexArticle = articlesSelected.findIndex((element) => element._id == targetElement.id && element.color == targetElement.color);

            articlesSelected[indexArticle].quantity = +event.target.value;

            localStorage.setItem('product', JSON.stringify(articlesSelected));
            productsPrice(articlesSelected);
        })
    }
}

// Validateur prénom/nom 
function namesValidation(inputName) {
    let errorMessage = inputName.nextElementSibling;
    let name = inputName.previousElementSibling.innerText.toLowerCase().slice(0, -1);
    if (inputName.value.length < 1) {
        errorMessage.innerText = `Le ` + name + ` que vous indiquez doit contenir au moins 1 caractère.`;
        return false;
    } else if (inputName.value.length > 50) {
        errorMessage.innerText = `Le ` + name + ` que vous indiquez doit contenir moins de 50 caractères.`;
        return false;
    } else if (inputName.value.replace(/[a-zA-Z\à\â\ä\é\è\ê\ë\ï\î\ô\ö\ù\û\ü\ÿ\ç\'\-]/gi, '') != '') {
        errorMessage.innerText = `Le ` + name + ` que vous indiquez contient un caractère qui n'est pas supporté.`;
        return false;
    } else {
        return true;
    }
}
// fin du Validateur prénom/nom 

// Validateur addresse 
function addressValidation(inputAddress) {
    let address = inputAddress.previousElementSibling.innerText.toLowerCase().slice(0, -1);

    if (inputAddress.value.replace(/[a-zA-Z0-9\à\â\ä\é\è\ê\ë\ï\î\ô\ö\ù\û\ü\ÿ\ç\'\-\ ]/gi, '') == '') {
        if (inputAddress.value.length < 1) {
            if (address == 'ville') {
                document.querySelector('#cityErrorMsg').innerText = `La ${address} que vous indiquez doit contenir au moins 1 caractère.`;
            } else {
                document.querySelector('#addressErrorMsg').innerText = `L'${address} que vous indiquez doit contenir au moins 1 caractère.`;
            }
            return false;
        } else if (inputAddress.value.length > 50) {
            if (address == 'ville') {
                document.querySelector('#cityErrorMsg').innerText = `La ${address} que vous indiquez doit contenir moins de 50 caractères.`;
            } else {
                document.querySelector('#addressErrorMsg').innerText = `L'${address} que vous indiquez doit contenir moins de 50 caractères.`;
            }
            return false;
        }
        return true;

    } else {
        if (address == 'ville') {
            document.querySelector('#cityErrorMsg').innerText = `La ${address} que vous indiquez n'est pas prise en compte.`;
        } else {

            document.querySelector('#addressErrorMsg').innerText = `L'${address} que vous indiquez n'est pas prise en compte.`;
        }
        return false;
    }
}
// fin du Validateur addresse 

// Validateur email 
function emailValidation(inputEmail) {
    let RegexExp = new RegExp(/[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})/);

    if (RegexExp.test(inputEmail.value)) {
        document.querySelector('#emailErrorMsg').innerText = '';
        return true;
    } else {
        document.querySelector('#emailErrorMsg').innerText = `L'adresse email que vous indiquez n'est pas valide`;
        return false;
    }
}
// Fin du Validateur email 

// récupère le contact et la liste produit et l'envoie en méthode post.
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
            location.href = './confirmation.html?orderId=' + data.orderId;
            localStorage.clear();
        })
}
// Fin de la fonction send 

// récupère les noeuds pour modifier et supprimer les produits.
async function modifyOrder() {
    const deleteBtn = document.querySelectorAll('.deleteItem');
    const inputNumber = document.querySelectorAll('.itemQuantity');
    const article = document.querySelectorAll('.cart__item');
    const section = document.getElementById('cart__items');

    deleteItem(deleteBtn, article, section);
    modifyQuantity(inputNumber);

}

// Ecoute des modifications de firstName
form.firstName.addEventListener('change', function () {
    namesValidation(this);
})

// Ecoute des modifications de lastName
form.lastName.addEventListener('change', function () {
    namesValidation(this);
})

// Ecoute des modifications de #address
form.address.addEventListener('change', function () {
    addressValidation(this);
})

// Ecoute des modifications de #city
form.city.addEventListener('change', function () {
    addressValidation(this);
})

// Ecoute des modifications de #email
form.email.addEventListener('change', function () {
    emailValidation(this);
})

// créer le contact et la liste des produits et l'envoie à la fonction send().
function order() {
    let contact = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value
    };

    let products = []

    getStorage().forEach(element => { products.push(element._id) });

    send(contact, products);
}

// Ecoute le bouton de #Order si les conditions sont remplies appelle la fonction order().
form.addEventListener('submit', async function (event) {
    event.preventDefault();
    currentStorage = await getStorage();

    if (emailValidation(form.email) && addressValidation(form.address) && addressValidation(form.city) && namesValidation(form.firstName) && namesValidation(form.lastName) && currentStorage != null && currentStorage.length != 0) {
        order();
    }
})

getProducts()
    .then(getLocalStorage())
    .then(setTimeout(modifyOrder, 500));
