const createProduits = () => fetch(`http://localhost:3000/api/products`)
    .then(res => res.json())
    .then(function (data) {
        const structure = data;

        function newArticle() {

            for (let i = 0; i < structure.length; i++) {

                const items = document.getElementById('items');
                let newItems = document.createElement('a');

                items.appendChild(newItems);
                newItems.setAttribute('href', './product.html?id=' + structure[0]._id);

                const article = document.createElement('article');

                let image = document.createElement('img');
                image.setAttribute('src', structure[i].imageUrl);
                image.setAttribute('alt', structure[i].altTxt);
                article.appendChild(image);
                newItems.appendChild(article);


                let header = document.createElement('h3');
                header.setAttribute('class', structure[i].name);
                header.innerText = structure[i].name;
                article.appendChild(header)

                let paragraphe = document.createElement('p')
                paragraphe.setAttribute('class', structure[i].name);
                paragraphe.innerText = structure[i].description
                article.appendChild(paragraphe);

            }
        }
        newArticle();

    })
    .catch(err => console.log(err))

createProduits();