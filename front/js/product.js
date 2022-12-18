var url = new URL(window.location.href);
const id = url.searchParams.get('id');

let upStorage = [];

// Récupère l'article avec l'id de l'url. 
const getProducts = async () => fetch(`http://localhost:3000/api/products/${id}`)
   .then(res => res.json())
   .then(function (data) {
      return data
   })
   .catch(err => console.log(err));

// récupère les couleurs de l'API du produit et ajoute ces valeurs
async function addColors(data) {
   const colors = document.getElementById('colors');

   for (let i in data.colors) {
      let newColors = document.createElement('option');
      newColors.setAttribute('value', data.colors[i]);
      newColors.innerText = data.colors[i];
      colors.appendChild(newColors);
   }
}

// trie les elements du tableau (upStorage) avant l'envoi au localStorage
function sortSelectedProducts(array) {
   array.sort((a, b) => {
      const nameA = a._id;
      const nameB = b._id;
      if (nameA < nameB) {
         return -1;
      }


      if (nameA > nameB) {
         return 1;
      }
      return 0;
   });
}

// Vérifie si le produit et la couleur sont dans le localstorage
function checkProductIdAndColor(storage, currentItem, infoProduct) {
   let j = 0;

   for (let product of storage) {
      if (product._id == currentItem._id && product.color == currentItem.color) {
         //  si le produit choisi existe de la couleur choisie ajoute la quantité 
         storage[j].quantity += currentItem.quantity;
         if (storage[j].quantity >= 100) {
            // si la quantité totale est supérieur à 100 dans le localstorage fixe celle-ci a 100
            storage[j].quantity = 100;
            alert('votre panier contient ' + storage[j].quantity + ' ' + infoProduct.name + ' ' + product.color);
            break;
         } else {
            alert('Vous avez ajouté ' + currentItem.quantity + ' au ' + infoProduct.name + ' ' + product.color);
            break;
         }
      } else if (j + 1 === storage.length) {
         //  sinon l'ajoute tel qu'il est
         storage.push(currentItem);
         alert(`Vous venez d'ajouter ` + currentItem.quantity + `  ` + infoProduct.name + ` ` + currentItem.color + ` à votre panier`);
         break;
      }
      j++;
   }

}

// Récupère les informations produits et les injecte dans le HTML
async function createProduct() {
   const infoProduct = await getProducts();
   const image = document.querySelector('.item__img');
   image.innerText = '';

   // injecte l'image
   let newImage = document.createElement('img');
   newImage.setAttribute('src', infoProduct.imageUrl);
   newImage.setAttribute('alt', infoProduct.altTxt);
   image.appendChild(newImage);

   //injecte le titre
   document.getElementById('title').innerText = infoProduct.name;

   // injecte le prix
   document.getElementById('price').innerText = infoProduct.price + ' ';

   // injecte la description
   document.getElementById('description').innerText = infoProduct.description;
   addColors(infoProduct);

}

// Ajoute au localstorage si celui-ci est vide sinon envoie à la fonction de vérification
function addToCart(infoProduct) {
   let newProduct = {
      _id: infoProduct._id,
      color: document.getElementById('colors').value,
      quantity: +document.getElementById('quantity').value,
   };

   if (localStorage.length != 0 && localStorage.getItem('product') != '[]') {
      upStorage = JSON.parse(localStorage.getItem('product'));
      checkProductIdAndColor(upStorage, newProduct, infoProduct);
   } else {
      upStorage.push(newProduct);
      alert(`Vous venez d'ajouter ` + newProduct.quantity + `  ` + infoProduct.name + ` ` + newProduct.color + ` à votre panier`);
   }

   sortSelectedProducts(upStorage);
   localStorage.setItem('product', JSON.stringify(upStorage));
}

// Ecoute le bouton addToCart
document.getElementById('addToCart').addEventListener('click', async function () {
   const infoProduct = await getProducts();

   // Vérification que des paramètres ont été entrés pour le panier 
   if (!document.getElementById('colors').value) {
      alert('Veuillez séléctionner une couleur.');
   } else if (document.getElementById('quantity').value == 0) {
      alert('Veuillez sélectioner une quantité');
   } else if (document.getElementById('quantity').value > 100) {
      alert('Veuillez sélectioner une quantité inférieur à 100');
   } else {
      addToCart(infoProduct);
   }
});

createProduct();