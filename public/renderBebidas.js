import { getAllBebidas } from "../services/getData.js";

document.addEventListener("DOMContentLoaded", async () => {
  const modal = document.getElementById("refri-modal");
  const form = document.getElementById("refri-form");

  // Safety: se não achou elementos, aborta com log
  if (!modal || !form) {
    console.error("Modal ou form não encontrados:", { modal, form });
    return;
  }

  // === build cards uma vez na carga (se já existirem, não recria) ===
  async function drinkCards() {
    // evita recriar se já existirem .refri-qty dentro do form
    if (form.querySelector(".refri-qty")) {
      console.log("drinkCards: já existem cards — pulando recriação");
      return;
    }

    const bebidas = await getAllBebidas();
    console.log("drinkCards -> bebidas recebidas:", bebidas);

    form.innerHTML = `
      ${bebidas.bebidas_disp
        .map(
          (bebida) => `
          <div class="flex items-center justify-between p-3 rounded-lg border bg-white">
            <span>${bebida.nome} (R$ ${bebida.preco} unidade)</span>
            <div class="flex items-center">
              <button class="refri-minus bg-[#5C4033] text-white w-8 h-8 rounded-l-full" data-flavor="${bebida.nome}" type="button">-</button>
              <span class="refri-qty bg-[#FCEBD5] w-10 h-8 flex items-center justify-center" data-flavor="${bebida.nome}" data-id="${bebida.id}" data-price="${bebida.preco}">0</span>
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

  await drinkCards();
  let addBtn = document.getElementById("refri-add");
  if (!addBtn) {
    console.error("Botão adicionar não encontrado após render:", form.innerHTML);
    addBtn = document.createElement("button"); // fallback para evitar erros
  }

  // === utilitários ===
  function updateAddState() {
    const sum = Array.from(form.querySelectorAll(".refri-qty"))
      .map((el) => parseInt(el.textContent) || 0)
      .reduce((a, b) => a + b, 0);

    const enable = sum > 0;
    addBtn.disabled = !enable;
    addBtn.classList.toggle("opacity-50", !enable);
    addBtn.classList.toggle("cursor-not-allowed", !enable);
  }

  function resetQuantities() {
    form.querySelectorAll(".refri-qty").forEach((el) => (el.textContent = "0"));
    updateAddState();
  }

  function openModal() {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    resetQuantities();
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    resetQuantities();
  }

  // === global click (abrir/fechar) ===
  document.addEventListener("click", (e) => {
    if (e.target.closest(".openDrinkModal")) openModal();
    if (e.target.closest(".close-refri-modal")) closeModal();
  });

  // === quantidade buttons via delegação ===
  form.addEventListener("click", (e) => {
    const minus = e.target.closest(".refri-minus");
    const plus = e.target.closest(".refri-plus");
    if (!minus && !plus) return;

    const flavor = (minus || plus).getAttribute("data-flavor");
    const qtyEl = form.querySelector(`.refri-qty[data-flavor="${CSS.escape(flavor)}"]`);
    if (!qtyEl) return;

    let q = parseInt(qtyEl.textContent) || 0;
    if (minus) q = Math.max(0, q - 1);
    if (plus) q++;
    qtyEl.textContent = String(q);

    updateAddState();
  });

  // === submit: proteção contra duplicidade e logs de diagnóstico ===
  if (!form.dataset.listenerAttached) {
    console.log("attach submit listener ao form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Proteção reentrância: se já submetendo, ignora
      if (form.dataset.submitting === "true") {
        console.warn("submit ignorado: já em submissão");
        return;
      }
      form.dataset.submitting = "true";

      // Disable imediato do botão para evitar múltiplos clicks
      addBtn.disabled = true;
      addBtn.classList.add("opacity-50", "cursor-not-allowed");

      // coletar itens
      const items = Array.from(form.querySelectorAll(".refri-qty"))
        .map((el) => ({
          id: el.getAttribute("data-id"),
          qty: parseInt(el.textContent) || 0,
          name: el.getAttribute("data-flavor") || "",
        }))
        .filter((it) => it.qty > 0);

      console.log("submit -> items coletados:", items);

      if (items.length === 0) {
        form.dataset.submitting = "false";
        updateAddState();
        return;
      }

      // Chama Cart.addItem para cada item, com log
      items.forEach(({ id, qty, name }) => {
        console.log(`submit -> adicionando ao carrinho id=${id} qty=${qty} name=${name}`);
        try {
          if (window.Cart && typeof Cart.addItem === "function") {
            Cart.addItem({ id, quantity: qty });
          } else {
            console.warn("Cart.addItem não disponível");
          }
        } catch (err) {
          console.error("erro ao chamar Cart.addItem:", err);
        }
      });

      // pequena espera para assegurar que UI atualiza (opcional)
      await new Promise((res) => setTimeout(res, 100));

      closeModal();

      // reset flags e botão
      form.dataset.submitting = "false";
      // recria referência ao botão (caso DOM tenha sido trocado)
      addBtn = document.getElementById("refri-add") || addBtn;
      updateAddState();
    });

    form.dataset.listenerAttached = "true";
  } else {
    console.log("submit listener já estava anexado — não anexo novamente");
  }
});
