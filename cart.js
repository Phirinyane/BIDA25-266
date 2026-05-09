const WHATSAPP_NUMBER = '26777580751'; 
let cart = JSON.parse(localStorage.getItem('parchd_cart') || '[]');

function saveCart() {
  localStorage.setItem('parchd_cart', JSON.stringify(cart));
}

// ── ADD TO CART ──
window.addToCart = function (product, variant, price, qty) {
  const key = product + '|' + variant;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ key, product, variant, price, qty });
  }
  saveCart();
  renderCart();
  window.openCart();
};

// ── REMOVE ITEM ──
window.cartRemove = function (key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  renderCart();
};

// ── UPDATE QTY ──
window.cartQty = function (key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart();
};

// ── TOTAL ──
function getTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

// ── BADGE ──
function updateBadge() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ── OPEN / CLOSE ──
window.openCart = function () {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeCart = function () {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
  window.showCartView();
};

// ── VIEWS ──
window.showCartView = function () {
  document.getElementById('cartView').style.display = 'flex';
  document.getElementById('checkoutView').style.display = 'none';
};

window.showCheckoutView = function () {
  if (cart.length === 0) return;
  document.getElementById('cartView').style.display = 'none';
  document.getElementById('checkoutView').style.display = 'flex';
  const el = document.getElementById('co-total-display');
  if (el) el.textContent = 'P' + getTotal().toFixed(2);
};

// ── RENDER CART ──
function renderCart() {
  updateBadge();
  const list = document.getElementById('cartList');
  const footer = document.getElementById('cartFooter');
  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>Your cart is empty</p>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <p class="cart-item-name">${item.product}</p>
        <p class="cart-item-variant">${item.variant}</p>
        <p class="cart-item-price">P${(item.price * item.qty).toFixed(2)}</p>
      </div>
      <div class="cart-item-controls">
        <div class="cart-qty">
          <button onclick="cartQty('${item.key}', -1)">&#8722;</button>
          <span>${item.qty}</span>
          <button onclick="cartQty('${item.key}', 1)">&#43;</button>
        </div>
        <button class="cart-remove" onclick="cartRemove('${item.key}')" aria-label="Remove">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  document.getElementById('cartTotal').textContent = 'P' + getTotal().toFixed(2);
}

// ── WHATSAPP CHECKOUT ──
window.sendWhatsAppOrder = function () {
  const name    = document.getElementById('co-name').value.trim();
  const phone   = document.getElementById('co-phone').value.trim();
  const payment = document.getElementById('co-payment').value;
  const err     = document.getElementById('co-error');

  if (!name || !phone || !payment) {
    err.textContent = 'Please fill in all fields.';
    return;
  }
  err.textContent = '';

  const lines = cart.map(i =>
    `• ${i.product} (${i.variant}) x${i.qty} — P${(i.price * i.qty).toFixed(2)}`
  ).join('\n');

  const message =
    `Hello ParchD! 🛒\n\n` +
    `*Order from ${name}*\n` +
    `📱 Contact: ${phone}\n\n` +
    `*Items:*\n${lines}\n\n` +
    `*Total: P${getTotal().toFixed(2)}*\n` +
    `*Payment: ${payment}*\n\n` +
    `Please confirm my order. Thank you!`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

  cart = [];
  saveCart();
  renderCart();
  window.closeCart();
};

// ── INJECT DRAWER HTML ──
function injectDrawer() {
  if (document.getElementById('cartDrawer')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <div id="cartOverlay" onclick="closeCart()"></div>

    <div id="cartDrawer">
      <div class="cart-header">
        <h3>Your Cart</h3>
        <button class="cart-close-btn" onclick="closeCart()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div id="cartView" style="display:flex;flex-direction:column;flex:1;overflow:hidden;">
        <div id="cartList"></div>
        <div id="cartFooter" style="display:none;">
          <div class="cart-total-row">
            <span>Total</span>
            <span id="cartTotal">P0.00</span>
          </div>
          <button class="btn-primary cart-checkout-btn" onclick="showCheckoutView()">Proceed to Checkout</button>
        </div>
      </div>

      <div id="checkoutView" style="display:none;flex-direction:column;flex:1;overflow:hidden;">
        <button class="cart-back-btn" onclick="showCartView()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Cart
        </button>
        <div class="checkout-form">
          <div class="co-field">
            <label>Your Name</label>
            <input type="text" id="co-name" placeholder="e.g. Thabo Mokoena">
          </div>
          <div class="co-field">
            <label>Phone Number</label>
            <input type="tel" id="co-phone" placeholder="e.g. 71234567">
          </div>
          <div class="co-field">
            <label>Payment Method</label>
            <select id="co-payment">
              <option value="">Select payment...</option>
              <option value="Orange Money">Orange Money</option>
              <option value="MyZaka (Mascom)">MyZaka (Mascom)</option>
              <option value="EFT / Bank Transfer">EFT / Bank Transfer</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>
          <p id="co-error" class="co-error"></p>
          <div class="co-summary">
            <span>Order Total</span>
            <strong id="co-total-display">P0.00</strong>
          </div>
          <button class="btn-whatsapp" onclick="sendWhatsAppOrder()">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.554 4.11 1.522 5.837L.057 23.571l5.86-1.537A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 0 1-5.001-1.368l-.359-.214-3.72.976.993-3.624-.234-.372A9.78 9.78 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
            </svg>
            Send Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  `);
}

// ── PATCH CART ICON ──
function patchCartIcon() {
  document.querySelectorAll('.cart-icon').forEach(icon => {
    icon.style.position = 'relative';
    if (!icon.querySelector('.cart-badge')) {
      const badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.style.display = 'none';
      icon.appendChild(badge);
    }
    icon.onclick = window.openCart;
  });
}

// ── INIT ──
function init() {
  injectDrawer();
  patchCartIcon();
  renderCart();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
