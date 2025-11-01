import { getAllBebidas } from "./services/getData.js";

document.addEventListener("DOMContentLoaded", async () => {
  const modal = document.getElementById("refri-modal");
  const form = document.getElementById("refri-form");

  // === 1️⃣ Cria as bebidas dinamicamente ===
  async function drinkCards() {
    const bebidas = await getAllBebidas();
    console.log(bebidas);

    form.innerHTML = `
      ${bebidas.bebidas_disp
        .map(
          (bebida) => `
          <div class="flex items-center justify-between p-3 rounded-lg border bg-white">
            <span>${bebida.nome}(R$ ${bebida.preco}unidade)</span>
            <div class="flex items-center">
              <button class="refri-minus bg-[#5C4033] text-white w-8 h-8 rounded-l-full" data-flavor="${bebida.nome}" type="button">-</button>
              <span class="refri-qty bg-[#FCEBD5] w-10 h-8 flex items-center justify-center" data-flavor="${bebida.nome}"data-id="${bebida.id}" price="${bebida.preco}">0</span>
              <button class="refri-plus bg-[#5C4033] text-white w-8 h-8 rounded-r-full" data-flavor="${bebida.nome}" type="button">+</button>
            </div>
          </div>`
        )
        .join("")}
      <button class="mt-4 w-full bg-[#3C6E47] opacity-50 cursor-not-allowed text-white py-3 rounded-full font-semibold transition"
        disabled id="refri-add" type="submit">
        Adicionar ao Carrinho
      </button>
    `;
  }

  await drinkCards(); // aguarda antes de capturar addBtn

  const addBtn = document.getElementById("refri-add");
  //const price = 6.5;

  // === 2️⃣ Funções utilitárias ===
  function updateAddState() {
    const sum = Array.from(form.querySelectorAll(".refri-qty"))
      .map((el) => parseInt(el.textContent) || 0)
      .reduce((a, b) => a + b, 0);

    const enable = sum > 0;
    addBtn.disabled = !enable;
    addBtn.classList.toggle("opacity-50", !enable);
    addBtn.classList.toggle("cursor-not-allowed", !enable);
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    form.querySelectorAll(".refri-qty").forEach((el) => (el.textContent = "0"));
    updateAddState();
  }

  function openModal() {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    form.querySelectorAll(".refri-qty").forEach((el) => (el.textContent = "0"));
    updateAddState();
  }

  // === 3️⃣ Eventos globais (1 só listener) ===
  document.addEventListener("click", (e) => {
    if (e.target.closest(".openDrinkModal")) {
      openModal();
    }
    if (e.target.closest(".close-refri-modal")) {
      closeModal();
    }
  });

  // === 4️⃣ Eventos internos do formulário ===
  form.addEventListener("click", (e) => {
    const minus = e.target.closest(".refri-minus");
    const plus = e.target.closest(".refri-plus");
    if (!minus && !plus) return;

    const flavor = (minus || plus).getAttribute("data-flavor");
    const qtyEl = form.querySelector(
      `.refri-qty[data-flavor="${CSS.escape(flavor)}"]`
    );

    let q = parseInt(qtyEl.textContent) || 0;
    if (minus) q = Math.max(0, q - 1);
    if (plus) q++;
    qtyEl.textContent = String(q);

    updateAddState();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const items = Array.from(form.querySelectorAll(".refri-qty"))
      .map((el) => ({
        id: el.getAttribute("data-id"),
        qty: parseInt(el.textContent) || 0,
      }))
      .filter((it) => it.qty > 0);

    if (items.length === 0) return;

    items.forEach(({ id, qty}) => {
      if (window.Cart && typeof Cart.addItem === "function") {
        Cart.addItem({
          id,
          quantity: qty,
        });
      }
    });

    closeModal();
  });
});
