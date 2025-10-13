import { getAllProducts } from "./services/getData.js";

document.addEventListener('DOMContentLoaded', () => {

  async function prodCards() {
    const produtos = await getAllProducts();
    const sectionTag = document.getElementById("ProdDiv");

    produtos.forEach((produto) => {
      const card = document.createElement("div");
      card.className = "product-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition";
      card.dataset.categoria = produto.tipo.toLowerCase();

      card.innerHTML = `
      <div class="h-100" id="${produto.id}">
        <img alt="${produto.nome}" class="w-full h-100 object-cover rounded-t-xl" src="${produto.img_url}" />
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

  const allowed = ['todos','assados','fritos','combos','bebidas'];

  function applyFilter(filter) {
    const f = (filter || 'todos').toLowerCase();

    document.querySelectorAll('.category-card').forEach(a => {
      const active = (a.dataset.filter || '').toLowerCase() === f;
      a.classList.toggle('ring-2', active);
      a.classList.toggle('ring-[#5C4033]', active);
    });

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      const cat = (card.dataset.categoria || '').toLowerCase();
      card.style.display = (f === 'todos' || cat === f) ? '' : 'none';
    });
  }

  document.addEventListener('click', e => {
    const link = e.target.closest('.category-card');
    if (!link) return;
    e.preventDefault();
    applyFilter(link.dataset.filter);
  });

  function initFromHash() {
    const h = (location.hash || '#todos').replace('#','').toLowerCase();
    applyFilter(allowed.includes(h) ? h : 'todos');
  }

  window.addEventListener('hashchange', initFromHash);
  window.initFromHash = initFromHash;

  // 🔹 Carrega cards e aplica filtro inicial
  prodCards().then(() => {
    window.initFromHash();
  });

});
