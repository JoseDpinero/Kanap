let Products = async () => fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(function (allProducts) {

        return allProducts
    });

Products();

class cartProduct {

    constructor(_id, color, quantity) {

        this._id = _id;
        this.color = color;
        this.quantity = quantity;

    }
    async checkProduct(element) {

        let allProducts = await Products();

        allProducts.forEach(elt => {

            if (element._id == elt['_id']) {

                this.createItem(element, elt);
            }

        });
        ;
    }

    async createItem(element, elt) {

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
        del.innerHTML = `<p class="deletItem"> Supprimer</p>`;

        article.appendChild(del);

    }

}
recupStorage = JSON.parse(localStorage.getItem('product'));

recupStorage.forEach(element => {

    let currentProduct = new cartProduct(element._id, element.color, element.quantity);

    currentProduct.checkProduct(element);

});


