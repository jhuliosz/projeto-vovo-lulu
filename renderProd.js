import {getAllProducts} from "./services/getData.js";
  
  async function prodCards() {
    let produtos = await getAllProducts();
    produtos.forEach((produto) => {
      let sectionTag = document.getElementById("ProdDiv");
      const card = document.createElement("div");
  card.className = "product-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition";
  card.dataset.categoria = produto.tipo;

  card.innerHTML = `
    <div class="h-100" id="${produto.id}">
<img alt="${produto.nome}" class="w-full h-100 object-cover rounded-t-xl" src="${produto.img_url}"/>
</div>
<div class="p-4">
<h3 class="font-bold text-xl mb-2">${produto.nome}</h3>
<p class="text-gray-600 mb-4">${produto.descricao}</p>
<div class="flex justify-between items-center">
<span class="font-bold text-lg">R$ ${produto.preco}</span>
<div class="flex items-center">
<button class="quantity-btn minus bg-[#5C4033] text-white w-8 h-8 rounded-l-full">-</button>
<span class="quantity bg-[#FCEBD5] w-10 h-8 flex items-center justify-center">1</span>
<button class="quantity-btn plus bg-[#5C4033] text-white w-8 h-8 rounded-r-full">+</button>
</div>
</div>
<button class="add-to-cart mt-4 w-full bg-[#3C6E47] text-white py-2 rounded-full font-semibold hover:bg-[#2d5536] transition">
                            Adicionar ao Carrinho
                        </button>
</div>
  `;
  sectionTag.appendChild(card);
    });
  }
  prodCards();