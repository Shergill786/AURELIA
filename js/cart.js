/* =========================================================
   cart.js — Cart page, Wishlist page, Checkout page logic
   ========================================================= */

const GST_RATE = 0.18;
const FREE_SHIP_THRESHOLD = 4999;
const SHIP_COST = 199;

function cartSubtotal(cart){ return cart.reduce((s,i)=> s + i.price*i.qty, 0); }

function renderCartPage(){
  const list = document.getElementById('cartList');
  if(!list) return;
  const cart = getCart();

  if(cart.length === 0){
    document.getElementById('cartWrap').innerHTML = `
      <div class="empty-state">
        <div class="icon-big">🛒</div>
        <h3>Your cart is empty</h3>
        <p style="color:var(--text-dim);margin:12px 0 24px;">Looks like you haven't added anything yet.</p>
        <a href="products.html" class="btn btn-primary">Continue Shopping</a>
      </div>`;
    return;
  }

  list.innerHTML = cart.map(item => `
    <div class="cart-item reveal in">
      <img src="${item.img}" alt="${item.name}">
      <div>
        <div class="ci-name">${item.name}</div>
        <div class="ci-meta">${Object.keys(item.opts||{}).length ? Object.values(item.opts).join(' / ') : 'Standard'}</div>
        <div class="qty-selector">
          <button onclick="changeQty('${item.key}', -1)">−</button>
          <input type="text" value="${item.qty}" readonly>
          <button onclick="changeQty('${item.key}', 1)">+</button>
        </div>
        <div class="ci-remove" onclick="removeFromCart('${item.key}')">Remove</div>
      </div>
      <div></div>
      <div class="ci-price">
        <span class="old">₹${(item.oldPrice*item.qty).toFixed(2)}</span>
        ₹${(item.price*item.qty).toFixed(2)}
      </div>
    </div>
  `).join('');

  updateCartTotals();
}

function changeQty(key, delta){
  const cart = getCart();
  const item = cart.find(i=>i.key===key);
  if(!item) return;
  item.qty = Math.max(1, item.qty+delta);
  setCart(cart);
  renderCartPage();
}
function removeFromCart(key){
  setCart(getCart().filter(i=>i.key!==key));
  renderCartPage();
  showToast('Item removed from cart');
}

let appliedCoupon = null;
function applyCoupon(){
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  const msg = document.getElementById('couponMsg');
  const valid = { "AURELIA10": 0.10, "GOLD20": 0.20, "WELCOME15": 0.15 };
  if(valid[code]){
    appliedCoupon = valid[code];
    msg.textContent = `Coupon applied — ${valid[code]*100}% off`;
    msg.style.color = 'var(--success)';
  } else {
    appliedCoupon = null;
    msg.textContent = 'Invalid coupon code';
    msg.style.color = 'var(--sale)';
  }
  updateCartTotals();
}

function updateCartTotals(){
  const cart = getCart();
  const subtotal = cartSubtotal(cart);
  const discount = appliedCoupon ? subtotal*appliedCoupon : 0;
  const afterDiscount = subtotal - discount;
  const gst = afterDiscount * GST_RATE;
  const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIP_COST);
  const total = afterDiscount + gst + shipping;

  const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.textContent = '₹'+val.toFixed(2); };
  set('sumSubtotal', subtotal);
  set('sumGst', gst);
  set('sumShipping', shipping);
  set('sumTotal', total);
  const discEl = document.getElementById('sumDiscountRow');
  if(discEl) discEl.style.display = discount>0 ? 'flex' : 'none';
  set('sumDiscount', discount);
  const shipMsg = document.getElementById('shipMsg');
  if(shipMsg) shipMsg.textContent = shipping===0 ? 'Free shipping applied' : `Add ₹${(FREE_SHIP_THRESHOLD-subtotal).toFixed(2)} more for free shipping`;

  // Persist total for checkout page summary
  Store.set('aurelia_order_totals', { subtotal, discount, gst, shipping, total });
}

/* ---------- Wishlist Page ---------- */
function renderWishlistPage(){
  const grid = document.getElementById('wishlistGrid');
  if(!grid) return;
  const wish = getWishlist();
  const items = PRODUCTS.filter(p=>wish.includes(p.id));
  if(items.length===0){
    document.getElementById('wishlistWrap').innerHTML = `
      <div class="empty-state">
        <div class="icon-big">♡</div>
        <h3>Your wishlist is empty</h3>
        <p style="color:var(--text-dim);margin:12px 0 24px;">Save items you love and find them here later.</p>
        <a href="products.html" class="btn btn-primary">Browse Products</a>
      </div>`;
    return;
  }
  grid.innerHTML = items.map(productCardHTML).join('');
  observeReveals();
}

/* ---------- Checkout Page ---------- */
function renderCheckoutSummary(){
  const el = document.getElementById('checkoutSummary');
  if(!el) return;
  const cart = getCart();
  const totals = Store.get('aurelia_order_totals', { subtotal:0, discount:0, gst:0, shipping:0, total:0 });
  el.innerHTML = cart.map(i=> `
    <div class="summary-row"><span>${i.name} × ${i.qty}</span><span>₹${(i.price*i.qty).toFixed(2)}</span></div>
  `).join('') + `
    <div class="summary-row"><span>Subtotal</span><span>₹${totals.subtotal.toFixed(2)}</span></div>
    ${totals.discount>0 ? `<div class="summary-row"><span>Discount</span><span>-₹${totals.discount.toFixed(2)}</span></div>` : ''}
    <div class="summary-row"><span>GST (18%)</span><span>₹${totals.gst.toFixed(2)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${totals.shipping===0?'Free':'₹'+totals.shipping.toFixed(2)}</span></div>
    <div class="summary-row total"><span>Grand Total</span><span>₹${totals.total.toFixed(2)}</span></div>
  `;
}

function validateField(field, condition){
  field.classList.toggle('invalid', !condition);
  return condition;
}

function placeOrder(e){
  e.preventDefault();
  const form = e.target;
  let valid = true;
  ['fullName','address','city','zip','phone'].forEach(id=>{
    const input = form.querySelector('#'+id);
    if(input){
      const field = input.closest('.field');
      valid = validateField(field, input.value.trim().length > 1) && valid;
    }
  });
  if(!valid){ showToast('Please complete required fields','error'); return; }

  // Save order to history
  const cart = getCart();
  const totals = Store.get('aurelia_order_totals', {total:0});
  const orders = Store.get('aurelia_orders', []);
  orders.unshift({
    id: 'AUR' + Math.floor(100000+Math.random()*900000),
    date: new Date().toLocaleDateString(),
    items: cart,
    total: totals.total,
    status: 'processing'
  });
  Store.set('aurelia_orders', orders);
  setCart([]);

  document.getElementById('successModal').classList.add('show');
}

function closeSuccessModal(){
  document.getElementById('successModal').classList.remove('show');
  window.location.href = 'orders.html';
}

/* ---------- Orders Page ---------- */
function renderOrdersPage(){
  const wrap = document.getElementById('ordersWrap');
  if(!wrap) return;
  const orders = Store.get('aurelia_orders', []);
  if(orders.length===0){
    wrap.innerHTML = `
      <div class="empty-state">
        <div class="icon-big">📦</div>
        <h3>No orders yet</h3>
        <p style="color:var(--text-dim);margin:12px 0 24px;">Once you place an order, it will show up here.</p>
        <a href="products.html" class="btn btn-primary">Start Shopping</a>
      </div>`;
    return;
  }
  const statusMap = { processing:['','','','',false], transit:[], delivered:[] };
  wrap.innerHTML = orders.map(o=>{
    const steps = ['Placed','Processing','Shipped','Delivered'];
    const activeIdx = o.status==='delivered'?4 : o.status==='transit'?3 : o.status==='processing'?2 : 1;
    return `
    <div class="order-card reveal in">
      <div class="order-top">
        <div><strong>Order ${o.id}</strong><div style="font-size:.8rem;color:var(--text-dim)">${o.date}</div></div>
        <span class="order-status ${o.status}">${o.status.charAt(0).toUpperCase()+o.status.slice(1)}</span>
      </div>
      <div class="order-track">
        ${steps.map((s,i)=>`<div class="track-step ${i < activeIdx ? 'done':''}"><div class="track-dot"></div><span>${s}</span></div>`).join('')}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:10px;">
        ${o.items.map(i=>`<img src="${i.img}" alt="${i.name}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;">`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
        <span style="color:var(--text-dim);">${o.items.reduce((s,i)=>s+i.qty,0)} item(s)</span>
        <strong>₹${o.total.toFixed(2)}</strong>
      </div>
    </div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCartPage();
  renderWishlistPage();
  renderCheckoutSummary();
  renderOrdersPage();
  document.getElementById('checkoutForm')?.addEventListener('submit', placeOrder);
  document.getElementById('applyCouponBtn')?.addEventListener('click', applyCoupon);
});
