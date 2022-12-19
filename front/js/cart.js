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

// récupère les données et lances les fonctions.
async function awaitDataAndLoading() {
    const items = await getProducts();
    const cartProducts = await cleanUnwantedItem(items);

    createArticles(cartProducts);
    productsPrice(cartProducts);

    const deleteBtn = document.querySelectorAll('.deleteItem');
    const inputNumber = document.querySelectorAll('.itemQuantity');
    const article = document.querySelectorAll('.cart__item');
    const section = document.getElementById('cart__items');

    deleteItem(deleteBtn, article, section, cartProducts);
    modifyQuantity(inputNumber, cartProducts);
}

// Si le Produit est dans l'API créé l'article sinon supprime l'entrée.
async function cleanUnwantedItem(items) {
    let itemsInLocalStorage = await getStorage();
    let wantedProducts = [];
    if (itemsInLocalStorage) {
        for (let i = 0; i < itemsInLocalStorage.length; i++) {
            let wantedItem = await checkProduct(itemsInLocalStorage[i]);
            if (wantedItem) {
                const found = items.find(element => element._id == itemsInLocalStorage[i]._id)
                wantedProducts.push({
                    '_id': found._id,
                    'name': found.name,
                    'color': itemsInLocalStorage[i].color,
                    'price': found.price,
                    'imageUrl': found.imageUrl,
                    'quantity': itemsInLocalStorage[i].quantity,
                    'altTxt': found.altTxt
                });
            }
        }
        return wantedProducts;
    }

}

// fait une boucle pour créer chaque article.
function createArticles(products) {
    for (let i = 0; i < products.length; i++) {
        createArticleItem(products[i]);
    }
}


// Fait le total des prix des produits sélectionnés et l'injecte dans le #totalPrice et #totalQuantity.
async function productsPrice(products) {
    let totalPrice = 0;
    let totalQuantity = 0;
    for (let i = 0; i < products.length; i++) {
        totalPrice += products[i].quantity * products[i].price;
        totalQuantity += products[i].quantity;
    }
    document.getElementById('totalPrice').innerText = totalPrice;
    document.getElementById('totalQuantity').innerText = totalQuantity;
}

// Vérifie que le produit est dans l'API 
async function checkProduct(item) {
    let allProducts = await getProducts();
    let indexArticle = allProducts.findIndex((element) => element._id == item._id);

    if (indexArticle != -1) {
        return allProducts[indexArticle];
    } else {
        return false;
    }
}

// Créé un article 
function createArticleItem(element) {
    const cart__item = document.getElementById('cart__items');
    cart__item.innerHTML += `<article class="cart__item" data-id="${element._id}" data-color="${element.color}">
<div class="cart__item__img">
<img src="${element.imageUrl}" alt="${element.altTxt}">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>${element.name}</h2>
    <p>${element.color}</p>
    <p>${element.price},00 €</p>
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
function deleteItem(deleteBtn, article, section, items) {
    for (let i = 0; i < deleteBtn.length; i++) {

        deleteBtn[i].addEventListener('click', function (event) {
            const targetElement = event.target.closest('.cart__item').dataset;
            let indexArticle = items.findIndex((element) => element._id == targetElement.id && element.color == targetElement.color);

            section.removeChild(article[i]);
            items.splice(indexArticle, 1);

            localStorage.setItem('product', JSON.stringify(items));
            productsPrice(items);
        })
    }
}


// Modifie la quantité d'un produit.
function modifyQuantity(number, items) {
    for (let i = 0; i < number.length; i++) {
        number[i].addEventListener('change', function (event) {
            const targetElement = event.target.closest('.cart__item').dataset;
            let indexArticle = items.findIndex((element) => element._id == targetElement.id && element.color == targetElement.color);

            items[indexArticle].quantity = +event.target.value;

            localStorage.setItem('product', JSON.stringify(items));
            productsPrice(items);
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
    let formContact = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value
    };

    let productSelected = []

    getStorage().forEach(element => { productSelected.push(element._id) });

    send(formContact, productSelected);
}

// Ecoute le bouton de #Order si les conditions sont remplies appelle la fonction order().
form.addEventListener('submit', async function (event) {
    event.preventDefault();
    currentStorage = await getStorage();

    if (emailValidation(form.email) && addressValidation(form.address) && addressValidation(form.city) && namesValidation(form.firstName) && namesValidation(form.lastName) && currentStorage != null && currentStorage.length != 0) {
        order();
    }
})

awaitDataAndLoading();
