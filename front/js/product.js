var url = new URL(window.location.href);
const id = url.searchParams.get('id');


const image = document.querySelector('.item__img');

const colors = document.getElementById('colors');


let quantitySelected = 0;

let upStorage = [];

const produit = () => fetch(`http://localhost:3000/api/products/${id}`)
    .then(res => res.json())
    .then(function (data) {

        const infoProduct = data;

        let newImage = document.createElement('img');
        newImage.setAttribute('src', infoProduct.imageUrl);
        newImage.setAttribute('alt', infoProduct.altTxt);
        image.appendChild(newImage);

        document.getElementById('title').innerText = infoProduct.name;

        document.getElementById('price').innerText = infoProduct.price + ' ';

        document.getElementById('description').innerText = infoProduct.description;

        function addColors() {

            for (let i in infoProduct.colors) {

                let newColors = document.createElement('option');
                newColors.setAttribute('value', infoProduct.colors[i]);
                newColors.innerText = infoProduct.colors[i];
                colors.appendChild(newColors);

            }
        }


        document.getElementById('addToCart').addEventListener('click', function () {
            if (!document.getElementById('colors').value) {
                alert('Veuillez séléctionner une couleur.');
            }
            else if (document.getElementById('quantity').value == 0) {
                alert('Veuillez sélectioner une quantité');
            } else if (document.getElementById('quantity').value >= 100) {
                alert('Veuillez sélectioner une quantité inférieur à 100');
            }
            /*Vérification que des paramètres ont été entrée pour le panier */

            else {

                colorSelected = document.getElementById('colors').value;
                quantitySelected = document.getElementById('quantity').value;

                let newProduct = {
                    _id: infoProduct._id,
                    color: colorSelected,
                    quantity: +quantitySelected,
                };


                if (localStorage.length != 0 &&  localStorage.getItem('product') != '[]') {

                    upStorage = JSON.parse(localStorage.getItem('product'));

                    let j = 0;
                    let lenghtLocalStorage = +upStorage.length;

                    for (let product of upStorage) {

                        if (product._id == newProduct._id && product.color == newProduct.color) {

                            upStorage[j].quantity += newProduct.quantity;

                            alert('Vous avez ajouté ' + newProduct.quantity + ' au ' + infoProduct.name + ' ' + product.color);

                            break;

                        }

                        else if (j + 1 === lenghtLocalStorage) {

                            upStorage.push(newProduct);

                            alert(`Vous venez d'ajouter ` + newProduct.quantity + `  ` + infoProduct.name + ` ` + newProduct.color + ` à votre panier`);
                            
                            break;
                        }
                        
                        j++;
                        
                    }
                    
                }
                else {
                    
                    upStorage.push(newProduct);
                    alert(`Vous venez d'ajouter ` + newProduct.quantity + `  ` + infoProduct.name + ` ` + newProduct.color + ` à votre panier`);

                }

                localStorage.setItem('product', JSON.stringify(upStorage));

                upStorage = [];

            }
        });

        addColors();

    })
    .catch(err => console.log(err));

produit();