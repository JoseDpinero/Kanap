
// Récupère les articles de l'API
const getProducts = () => fetch(`http://localhost:3000/api/products`)
   .then(res => res.json())
   .then(data => { return data })
   .catch(err => console.log(err))

// récupère les données de l'API et créé un lien vers l'article 
async function createArticles() {
   let products = await getProducts();
   const items = document.getElementById('items');
   items.innerText = '';

   for (let i = 0; i < products.length; i++) {
      let newItems = document.createElement('a');

      // injecte le lien du produit dans la section #items
      items.appendChild(newItems);
      newItems.setAttribute('href', './product.html?id=' + products[i]._id);

      const article = document.createElement('article');

      // injecte l'image au lien 
      let image = document.createElement('img');
      image.setAttribute('src', products[i].imageUrl);
      image.setAttribute('alt', products[i].altTxt);
      article.appendChild(image);
      newItems.appendChild(article);

      // injecte le titre du produit
      let header = document.createElement('h3');
      header.setAttribute('class', products[i].name);
      header.innerText = products[i].name;
      article.appendChild(header)

      // injecte la description du produit
      let paragraphe = document.createElement('p')
      paragraphe.setAttribute('class', products[i].name);
      paragraphe.innerText = products[i].description
      article.appendChild(paragraphe);
   }
}


createArticles();