// =====================
// EVENTOS GLOBAIS
// =====================

// --- Toggle do menu mobile ---
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// --- Carrinho ---
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartCounts = document.querySelectorAll('#cart-count, .cart-count');

function toggleCart() {
  cartSidebar.classList.toggle('cart-closed');
  cartSidebar.classList.toggle('cart-open');
  overlay.classList.toggle('hidden');
  document.body.classList.toggle('overflow-hidden');
}

// Usa Cart.toggleCart se ele já existir
closeCartBtn.addEventListener('click', Cart.toggleCart);
overlay.addEventListener('click', Cart.toggleCart);

// =====================
// DELEGAÇÃO DE EVENTOS PARA PRODUTOS
// =====================

const prodDiv = document.getElementById('ProdDiv');

prodDiv.addEventListener('click', (e) => {
  const target = e.target;

  // -----------------------
  // 1️⃣ Botão de adicionar ao carrinho
  // -----------------------
  if (target.classList.contains('add-to-cart')) {
    const productCard = target.closest('.product-card');
    const prodId = productCard.dataset.id;
  /*  const productName = productCard.querySelector('h3').textContent;
    const productPrice = parseFloat(
      productCard.querySelector('span').textContent
        .replace('R$ ', '')
        .replace(',', '.')
    );*/
    const quantity = parseInt(productCard.querySelector('.quantity').textContent);

    const product = { id:prodId,  quantity: quantity };
    Cart.addItem(product);
  }

  // -----------------------
  // 2️⃣ Botões de quantidade (+ / -)
  // -----------------------
  if (target.classList.contains('quantity-btn')) {
    const quantityElement = target.parentElement.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent);

    if (target.classList.contains('minus') && quantity > 1) {
      quantity--;
    } else if (target.classList.contains('plus')) {
      quantity++;
    }

    quantityElement.textContent = quantity;
  }
});

// =====================
// ATUALIZAÇÃO DE CARRINHO E CHECKOUT
// =====================

let cart = [];
let subtotal = 0;
const deliveryFee = 5;

function updateCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  subtotal = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-10">
        <img src="IMG/CarrinhoDesktop.png" alt="Carrinho" class="w-20 h-20 object-contain" loading="lazy">
        <p class="text-gray-500">Seu carrinho está vazio</p>
      </div>
    `;
    cartCounts.forEach(span => span.textContent = '0');
  } else {
    cartItemsContainer.innerHTML = '';
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const cartItem = document.createElement('div');
      cartItem.className = 'flex justify-between items-center py-3 border-b';
      cartItem.innerHTML = `
        <div class="flex-1">
          <h4 class="font-medium">${item.name}</h4>
          <div class="flex items-center mt-1">
            <button class="edit-quantity mr-2 text-xs text-gray-500 hover:text-[#5C4033]" data-index="${index}">
              <i class="fas fa-edit mr-1"></i>Editar
            </button>
            <button class="remove-item text-xs text-red-500 hover:text-red-700" data-index="${index}">
              <i class="fas fa-trash-alt mr-1"></i>Remover
            </button>
          </div>
        </div>
        <div class="text-right">
          <div class="font-medium">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
          <div class="text-sm">x${item.quantity}</div>
          <div class="font-bold">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    cartCounts.forEach(span => span.textContent = cart.reduce((t, i) => t + i.quantity, 0));
  }

  document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  document.getElementById('total').textContent = `R$ ${(subtotal + deliveryFee).toFixed(2).replace('.', ',')}`;
}

// =====================
// DELEGAÇÃO DE EVENTOS PARA O CARRINHO
/* =====================
document.getElementById('cart-items').addEventListener('click', (e) => {
  const target = e.target.closest('button');
  if (!target) return;

  const index = parseInt(target.getAttribute('data-index'));

  if (target.classList.contains('remove-item')) {
    cart.splice(index, 1);
    updateCart();
  }

  if (target.classList.contains('edit-quantity')) {
    const item = cart[index];
    const newQuantity = prompt(`Quantidade de ${item.name}:`, item.quantity);
    if (newQuantity && !isNaN(newQuantity) && parseInt(newQuantity) > 0) {
      item.quantity = parseInt(newQuantity);
      updateCart();
    }
  }


    // Generate WhatsApp message
    let whatsappMessage = `Olá Vovó Lulu! Gostaria de fazer um pedido:\n\n`;
    whatsappMessage += `*Nome:* ${name}\n`;
    whatsappMessage += `*Telefone:* ${phone}\n`;
    whatsappMessage += `*Endereço:* ${address}\n`;
    whatsappMessage += `*Forma de Pagamento:* ${payment}\n\n`;
    whatsappMessage += `*Itens do Pedido:*\n`;

    cart.forEach(item => {
        whatsappMessage += `- ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
    });

    whatsappMessage += `\n*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    whatsappMessage += `*Taxa de Entrega:* R$ ${deliveryFee.toFixed(2).replace('.', ',')}\n`;
    whatsappMessage += `*Total:* R$ ${(subtotal + deliveryFee).toFixed(2).replace('.', ',')}\n\n`;
    whatsappMessage += `Por favor, confirmem meu pedido! Obrigado!`;

    whatsappBtn.href = `https://wa.me/5511953717180?text=${encodeURIComponent(whatsappMessage)}`;

    checkoutModal.classList.add('hidden');
    confirmationModal.classList.remove('hidden');
});*/
const closeConfirmationBtn = document.querySelector("#close-confirmation");
closeConfirmationBtn.addEventListener('click', () => {
    confirmationModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');

    // Clear cart after order is confirmed
    cart = [];
    updateCart();

    // Reset form
    checkoutForm.reset();
});