import { getBebidas, getCombos, getProduct } from "../services/getData.js";

// cart.js — Carrinho compartilhado entre páginas (persistência + UI)
(function () {
  const CART_KEY = 'vovolulu_cart_v1';

  // Estado em memória
  let cart = [];
  let updateTimeout = null;
  let subtotal = 0;
  const deliveryFee = 5;

  // --- Persistência ---
  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Não foi possível salvar o carrinho:', e);
    }
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) cart = parsed;
      }
    } catch (e) {
      console.warn('Não foi possível carregar o carrinho:', e);
    }
    updateCart();
  }

  // --- UI helpers ---
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return document.querySelectorAll(sel); }

  function getUIRefs() {
    return {
      cartSidebar: qs('#cart-sidebar'),
      overlay: qs('#overlay'),
      closeCartBtn: qs('#close-cart'),
      cartItemsContainer: qs('#cart-items'),
      subtotalEl: qs('#subtotal'),
      totalEl: qs('#total'),
      clearCartBtn: qs('#clear-cart-btn'),
      checkoutBtn: qs('#checkout-btn'),
      checkoutModal: qs('#checkout-modal'),
      closeCheckoutBtn: qs('#close-checkout'),
      confirmationModal: qs('#confirmation-modal'),
      closeConfirmationBtn: qs('#close-confirmation'),
      checkoutForm: qs('#checkout-form'),
      orderDetails: qs('#order-details'),
      whatsappBtn: qs('#whatsapp-btn'),
      mobileCartLink: qs('#mobile-cart-btn'),
      cartCounts: qsa('#cart-count, .cart-count')
    };
  }

  // --- Abertura/fechamento do carrinho ---
  function openCart() {
    const { cartSidebar, overlay, mobileCartLink } = getUIRefs();
    if (cartSidebar) {
      cartSidebar.classList.remove('cart-closed');
      cartSidebar.classList.add('cart-open');
    }
    if (overlay) overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    if (mobileCartLink) {
      mobileCartLink.classList.add('text-[#F4A261]');
      mobileCartLink.blur();
    }
  }

  function closeCart() {
    const { cartSidebar, overlay, mobileCartLink } = getUIRefs();
    if (cartSidebar) {
      cartSidebar.classList.remove('cart-open');
      cartSidebar.classList.add('cart-closed');
    }
    if (overlay) overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    if (mobileCartLink) {
      mobileCartLink.classList.remove('text-[#F4A261]');
      mobileCartLink.blur();
    }
  }

  function toggleCart() {
    const { cartSidebar } = getUIRefs();
    if (!cartSidebar) return;
    if (cartSidebar.classList.contains('cart-open')) closeCart();
    else openCart();
  }
  async function getItemById(id, details = false) {
  const funcs = [getProduct, getBebidas, getCombos];
  try {
    for (let f = 0; f < funcs.length; f++) {
      try {
        console.log("id ->", id);
        const ret = await funcs[f](id);

        if (ret.name || ret.nome) {
          const nome = ret.name || ret.nome || false;
          const preco = ret.price || ret.preco || false;
          const disp = ret.disponibilidade ?? true;

          if (funcs[f].name === "getBebidas") {
            return { name: nome, price: parseFloat(preco) };
          } else if(disp === true && !ret.error && details){
            return { name: `${nome}(${details})`, price: parseFloat(preco) };
          } else if (disp === true && !ret.error) {
            return { name: nome, price: parseFloat(preco) };
          }else {
            continue;
          }
        }
      } catch (e) {
        console.warn(`Erro ao buscar com ${funcs[f].name}:`, e);
        continue;
      }
    }

    // Se nenhum retornou nada
    return { name: false, price: false };

  } catch (error) {
    console.error("Erro em getItemById:", error);
    return { name: false, price: false };
  }
}

async function getComboById(id, details) {
  try{
    const ret = await getCombos(id);
              const nome = ret.name || ret.nome || false;
          const preco = ret.price || ret.preco || false;

          return {name: `${nome}(${details})`, price: preco};
  }catch(error){
    return { name: false, price: false };

  }
}


      // --- Atualiza UI do carrinho ---
      async function updateCart() {
        const {
          cartItemsContainer,
          subtotalEl,
          totalEl,
          cartCounts
        } = getUIRefs();

        subtotal = 0;

        if (cartItemsContainer) {
          if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
          <div class="text-center py-10">
            <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-3"></i>
            <p class="text-gray-500">Seu carrinho está vazio</p>
          </div>`;
          } else {
            cartItemsContainer.innerHTML = '';
            for (let item = 0; item < cart.length; item++) {
              const details = cart[item].details || false;
                const { name, price } = await getItemById(cart[item].id, details ); 
              console.log("Item carregado:", cart[item].id, name, price);
              if (!price) continue;
              const itemTotal = price * cart[item].quantity;
              subtotal += itemTotal;

              const el = document.createElement('div');
              el.className = 'flex justify-between items-center py-3 border-b';
              el.innerHTML = `
            <div class="flex-1">
              <h4 class="font-medium">${name}</h4>
              <div class="flex items-center mt-1">
                <button class="edit-quantity mr-2 text-xs text-gray-500 hover:text-[#5C4033]" data-index="${item}">
                  <i class="fas fa-edit mr-1"></i>Editar
                </button>
                <button class="remove-item text-xs text-red-500 hover:text-red-700" data-index="${item}">
                  <i class="fas fa-trash-alt mr-1"></i>Remover
                </button>
              </div>
            </div>
            <div class="text-right">
              <div class="font-medium">R$ ${price.toFixed(2).replace('.', ',')}</div>
              <div class="text-sm">x${cart[item].quantity}</div>
              <div class="font-bold">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
            </div>`;
              cartItemsContainer.appendChild(el);
            };

            // listeners para remover/editar itens
            cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
              btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cart.splice(idx, 1);
                updateCart();
              });
            });
            cartItemsContainer.querySelectorAll('.edit-quantity').forEach(btn => {
              btn.addEventListener('click', async (e) => {
                const idx = parseInt(btn.dataset.index);
                const item = cart[idx];
                const { name } = await getItemById(item.id);
                const newQty = prompt(`Quantidade de ${name}:`, item.quantity);
                if (newQty !== null && !isNaN(newQty) && parseInt(newQty) > 0) {
                  cart[idx].quantity = parseInt(newQty);
                  updateCart();
                }
              });
            });

          }
        }

        // Atualiza contadores (header + mobile)
        if (cartCounts && cartCounts.length) {
          const count = cart.reduce((t, it) => t + it.quantity, 0);
          cartCounts.forEach(span => span.textContent = String(count));
        }

        // Subtotais/total
        if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        if (totalEl) totalEl.textContent = `R$ ${(subtotal + deliveryFee).toFixed(2).replace('.', ',')}`;

        // Persiste
        saveCart();
      }

      // --- API pública para páginas adicionarem itens ---
      function addItem({ id, details = false, quantity = 1 }) {
  const existing = cart.find(item => item.id === id);
  if (existing && !details) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, details, quantity });
  }
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    updateCart();
  }, 100);
  openCart();
}


      function clearCart() {
        cart = [];
        updateCart();
        try { localStorage.removeItem(CART_KEY); } catch (e) { }
      }

      function getItems() {
        return cart.slice();
      }

      // --- Bindings globais e inicialização ---
      async function bindUI() {
        const {
          closeCartBtn, overlay,
          clearCartBtn, checkoutBtn,
          checkoutModal, closeCheckoutBtn,
          confirmationModal, closeConfirmationBtn,
          checkoutForm, orderDetails, whatsappBtn
        } = getUIRefs();

        // Delegação para qualquer .cart-btn (header/mobile)
        document.addEventListener('click', (e) => {
          const btn = e.target.closest('.cart-btn');
          if (btn) {
            e.preventDefault();
            toggleCart();
          }
        });

        if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
        if (overlay) overlay.addEventListener('click', closeCart);

        // Limpar carrinho
        if (clearCartBtn) {
          clearCartBtn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja limpar o carrinho?')) clearCart();
          });
        }

        // Checkout
        if (checkoutBtn && checkoutModal) {
          checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) { alert('Seu carrinho está vazio!'); return; }
            closeCart();
            checkoutModal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
          });
        }
        if (closeCheckoutBtn && checkoutModal) {
          closeCheckoutBtn.addEventListener('click', () => {
            checkoutModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
          });
        }

        // Confirmar pedido
        if (checkoutForm && confirmationModal && orderDetails && whatsappBtn) {
          checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = qs('#name')?.value || '';
            const phone = qs('#phone')?.value || '';
            const address = qs('#address')?.value || '';
            const payment = (document.querySelector('input[name="payment"]:checked')?.value) || '';

            let orderSummary = `
          <p><strong>Cliente:</strong> ${name}</p>
          <p><strong>Telefone:</strong> ${phone}</p>
          <p><strong>Endereço:</strong> ${address}</p>
          <p><strong>Pagamento:</strong> ${payment}</p>
          <hr class="my-2">
          <p class="font-bold mb-1">Itens do Pedido:</p>
          <ul class="list-disc pl-5 mb-2">
        `;

            for (const item of cart) {
              const { name,details, price } = await getItemById(item.id);
              if(item.details){
                              orderSummary += `<li>${item.quantity}x ${name}(${item.details}) - R$ ${(price * item.quantity).toFixed(2).replace('.', ',')}</li>`;
              }else{
                orderSummary += `<li>${item.quantity}x ${name} - R$ ${(price * item.quantity).toFixed(2).replace('.', ',')}</li>`;
              }
            }


            orderSummary += `
          </ul>
          <hr class="my-2">
          <p><strong>Subtotal:</strong> R$ ${subtotal.toFixed(2).replace('.', ',')}</p>
          <p><strong>Taxa de Entrega:</strong> R$ ${deliveryFee.toFixed(2).replace('.', ',')}</p>
          <p class="font-bold"><strong>Total:</strong> R$ ${(subtotal + deliveryFee).toFixed(2).replace('.', ',')}</p>
        `;

            orderDetails.innerHTML = orderSummary;

            // WhatsApp message
            let whatsappMessage = `Olá Vovó Lulu! Gostaria de fazer um pedido:\n\n` +
              `*Nome:* ${name}\n` +
              `*Telefone:* ${phone}\n` +
              `*Endereço:* ${address}\n` +
              `*Forma de Pagamento:* ${payment}\n\n` +
              `*Itens do Pedido:*\n`;

            for (const item of cart) {
              const { name, price } = await getItemById(item.id);
              if(item.details){
                whatsappMessage += `- ${item.quantity}x ${name}(${item.details}) - R$ ${(price * item.quantity).toFixed(2).replace('.', ',')}\n`;

              }else{
                whatsappMessage += `- ${item.quantity}x ${name} - R$ ${(price * item.quantity).toFixed(2).replace('.', ',')}\n`;
              }
            }


            whatsappMessage += `\n*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n` +
              `*Taxa de Entrega:* ${deliveryFee.toFixed(2).replace('.', ',')}\n` +
              `*Total:* R$ ${(subtotal + deliveryFee).toFixed(2).replace('.', ',')}\n\n` +
              `Por favor, confirmem meu pedido! Obrigado!`;

            if (whatsappBtn) {
              whatsappBtn.href = `https://wa.me/5511953717180?text=${encodeURIComponent(whatsappMessage)}`;
            }

            checkoutModal.classList.add('hidden');
            confirmationModal.classList.remove('hidden');
          });
        }

        if (closeConfirmationBtn && confirmationModal) {
          closeConfirmationBtn.addEventListener('click', () => {
            confirmationModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            clearCart(); // limpa e remove do storage
          });
        }
      }

      // API pública
      window.Cart = {
        addItem,
        clear: clearCart,
        getItems,
        update: updateCart,
        open: openCart,
        close: closeCart,
        toggle: toggleCart
      };

      // Inicializa quando a página carregar
      document.addEventListener('DOMContentLoaded', () => {
        loadCart();
        bindUI();
      });
    }) ();
