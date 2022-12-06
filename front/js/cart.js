let Products = async () => fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(function (data) {

        return data
    });

function getStorage() {
    return JSON.parse(localStorage.getItem('product'))
}

function productsPrice(products) {

    let totalPrice = 0;
    let totalQuantity = 0;

    for (let i = 0; i < products.length; i++) {

        totalPrice += products[i].quantity * products[i].price;
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

    let elt = await this.checkProduct(element);

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

function createCartItems() {

    let currentStorage = getStorage();

    currentStorage.forEach(element => { createArticleItem(element); });
    productsPrice(currentStorage);

}


async function modifyOrder() {
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
