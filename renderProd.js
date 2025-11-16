import { getAllProducts } from "./services/getData.js";

document.addEventListener('DOMContentLoaded', () => {

  async function prodCards() {
    const produtos = await getAllProducts();
    const sectionTag = document.getElementById("ProdDiv");

    produtos.forEach((produto) => {
      if (produto.tipo != "combos") {

        const card = document.createElement("div");
        card.className = "product-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition";
        card.dataset.categoria = produto.tipo.toLowerCase();
        card.dataset.id = produto.id;

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
      } else {
        // supondo que produto.multiplicador.valor = 40 (ex: combo40)
        const comboId = `combo${produto.id}-modal`;
        const comboNome = produto.nome;
        const sabores = produto.sabores || []; // array com strings dos sabores disponíveis

        // cria o container principal do modal
        const modal = document.createElement("div");
        modal.className = "fixed inset-0 z-[60] hidden";
        modal.id = comboId;
        modal.dataset.prodId = produto.id;

        modal.innerHTML = `
  <div class="absolute inset-0 bg-black bg-opacity-50" data-overlay="${comboId}"></div>
  <div class="relative z-[61] flex items-start justify-center min-h-screen p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative">
      <button aria-label="Fechar" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700" id="close-${comboId}">
        <i class="fas fa-times text-2xl"></i>
      </button>
      <h2 class="title-font text-2xl font-bold mb-1">Monte seu Combo (${produto.qtd_max} unidades)</h2>
      <p class="text-sm text-gray-600 mb-4">
        Adicione de 5 em 5 por sabor. 
        <span class="font-semibold" id="${comboId}-counter">Selecionados: 0/${produto.qtd_max}</span>
      </p>
      <form class="space-y-3" id="${comboId}-form" data-step="${produto.multiplicador}">
        ${produto.recheios.map(flavor => `
          <div class="flex items-center justify-between p-3 rounded-lg border bg-white">
            <span>${flavor}</span>
            <div class="flex items-center">
              <button class="combo-minus bg-[#5C4033] text-white w-8 h-8 rounded-l-full" data-flavor="${flavor}" type="button">-</button>
              <span class="combo-qty bg-[#FCEBD5] w-12 h-8 flex items-center justify-center" data-flavor="${flavor}">0</span>
              <button class="combo-plus bg-[#5C4033] text-white w-8 h-8 rounded-r-full" data-flavor="${flavor}" type="button">+</button>
            </div>
          </div>
        `).join('')}
        <button class="add-to-cart mt-4 w-full bg-[#3C6E47] opacity-50 cursor-not-allowed text-white py-3 rounded-full font-semibold transition " disabled id="${comboId}-add">
          Adicionar ao Carrinho
        </button>
      </form>
    </div>
  </div>
`;


        document.body.appendChild(modal); // adiciona o modal no body

        // adiciona também o card do combo
        const card = document.createElement("div");
        card.className = "product-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition";
        card.dataset.categoria = "combos";
        modal.dataset.id = produto.id;

        card.innerHTML = `
          <div class="h-100" id="${produto.id}">
            <img alt="${comboNome}" class="w-full h-100 object-cover rounded-t-xl" src="${produto.img_url}" />
          </div>
          <div class="p-4">
            <h3 class="font-bold text-xl mb-2">${comboNome}</h3>
            <p class="text-gray-600 mb-4">${produto.descricao}</p>
            <span class="font-bold text-lg">R$ ${produto.preco}</span>
            <button class="open-combo mt-4 w-full bg-[#3C6E47] text-white py-2 rounded-full font-semibold hover:bg-[#2d5536] transition" data-target="${comboId}">
              Montar Combo
            </button>
          </div>
        `;
        sectionTag.appendChild(card);
      }
    });
  }

  const allowed = ['todos', 'assados', 'fritos', 'combo', 'doces'];

  function applyFilter(filter) {
    const f = (filter || 'todos').toLowerCase();

    document.querySelectorAll('.category-card').forEach(a => {
      const active = ((a.dataset.filter || '').toLowerCase() === f) || (f === 'combo' && (a.dataset.filter || '').toLowerCase() === 'combo_fixo');
      a.classList.toggle('ring-2', active);
      a.classList.toggle('ring-[#5C4033]', active);
    });

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      const cat = (card.dataset.categoria || '').toLowerCase();
      card.style.display = (f === 'todos' || cat === f || (f === 'combo' && cat === 'combo_fixo')) ? '' : 'none';
    });
  }

  document.addEventListener('click', e => {
    const link = e.target.closest('.category-card');
    if (!link) return;
    e.preventDefault();
    applyFilter(link.dataset.filter);
  });

  function initFromHash() {
    const h = (location.hash || '#todos').replace('#', '').toLowerCase();
    applyFilter(allowed.includes(h) ? h : 'todos');
  }

  window.addEventListener('hashchange', initFromHash);
  window.initFromHash = initFromHash;

prodCards().then(() => {
  // --- ABRIR E FECHAR MODAIS ---
  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest(".open-combo");
    if (openBtn) {
      const targetId = openBtn.dataset.target;
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
      }
    }

    const closeBtn = e.target.closest("[id^='close-combo']");
    if (closeBtn) {
      const modal = closeBtn.closest(".fixed");
      if (modal) {
        modal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      }
    }

    if (e.target.dataset.overlay) {
      const modal = document.getElementById(e.target.dataset.overlay);
      if (modal) {
        modal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      }
    }
  });

  // --- CONTROLE DE QUANTIDADES DENTRO DOS COMBOS ---
  document.addEventListener("click", (e) => {
    const plusBtn = e.target.closest(".combo-plus");
    const minusBtn = e.target.closest(".combo-minus");

    if (!plusBtn && !minusBtn) return;

    // encontra o modal ativo
    const modal = e.target.closest(".fixed");
    const form = modal.querySelector("form");
    const counter = modal.querySelector(`[id$="-counter"]`);
    const addBtn = modal.querySelector(`[id$="-add"]`);
    const max = parseInt(counter.textContent.match(/\/(\d+)/)[1]); 

    const step = parseInt(form.dataset.step) || 5;
    console.log("Step:"+form.dataset.step )
    const qtySpans = form.querySelectorAll(".combo-qty");

    let total = 0;
    qtySpans.forEach(q => total += parseInt(q.textContent));

    let span;
    let atual;
    
    //cart.addId
    if (plusBtn) {
      span = plusBtn.parentElement.querySelector(".combo-qty");
      atual = parseInt(span.textContent);

      if (total < max) {
        const restante = max - total;
        const incremento = Math.min(step, restante);
        span.textContent = atual + incremento;
      }
    }

    if (minusBtn) {
      span = minusBtn.parentElement.querySelector(".combo-qty");
      atual = parseInt(span.textContent);

      if (atual > 0) {
        span.textContent = Math.max(0, atual - step);
      }
    }

    total = 0;
    qtySpans.forEach(q => total += parseInt(q.textContent));
    counter.textContent = `Selecionados: ${total}/${max}`;

    if (total === max) {
      addBtn.disabled = false;
      addBtn.classList.remove("opacity-50", "cursor-not-allowed");
    } else {
      addBtn.disabled = true;
      addBtn.classList.add("opacity-50", "cursor-not-allowed");
    }
  });
    // --- ADICIONAR COMBO AO CARRINHO ---
  document.addEventListener("click", (e) => {
    const addComboBtn = e.target.closest(".add-to-cart");
    if (!addComboBtn || !addComboBtn.id.endsWith("-add")) return;

    e.preventDefault();

    const modal = addComboBtn.closest(".fixed");
    const form = modal.querySelector("form");
    const comboName = modal.querySelector(".title-font").textContent;
    const comboPrice = parseFloat(
      document.querySelector(`button[data-target='${modal.id}']`)
        .closest(".product-card")
        .querySelector("span.font-bold")
        .textContent
        .replace("R$ ", "")
        .replace(",", ".")
    );

    // coleta os sabores selecionados
    const flavors = [];
    form.querySelectorAll(".combo-qty").forEach((span) => {
      const qty = parseInt(span.textContent);
      if (qty > 0) {
        const flavor = span.dataset.flavor;
        flavors.push(`${qty}x ${flavor}`);
      }
    });

    const comboDetails = flavors.join(", ");

    const product = {
      id: modal.dataset.prodId,
      details: comboDetails,
      quantity: 1, // cada combo conta como 1 item
    };

    Cart.addItem(product);

    // fechar o modal e restaurar o scroll
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  });


    window.initFromHash();
  });


});
