/* ============================================================
   EarthGrit – cart.js
   Handles: cart state, rendering, checkout validation,
            Stripe payment, WhatsApp order

   To change the Firebase endpoint: update CHECKOUT_API_URL
   To change WhatsApp number: update WHATSAPP_NUMBER
============================================================ */

var CHECKOUT_API_URL = 'https://api-vzhrfgyteq-uc.a.run.app/createStripeSession';
var WHATSAPP_NUMBER  = '447344445351';

var cart = [];

/* ---------- Add / Remove ---------- */

function addToCart(id, qty) {
  const p  = PRODUCTS.find(x => x.id === id);
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty += qty;
  else cart.push({ ...p, qty });
  renderCart();
  updateCount();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  renderCart();
  updateCount();
}

/* ---------- Render Cart List ---------- */

function renderCart() {
  const list = document.getElementById('cart-list');

  if (!cart.length) {
    list.innerHTML = '<p style="color:#888;text-align:center;padding:20px">Your bag is empty</p>';
    return;
  }

  const rows = cart.map(i => {
    const offer       = getOffer(i.id);
    const unitPrice   = getUnitPrice(i.id, i.qty, i.priceNow);
    const subtotal    = calculatePrice(i.id, i.qty, i.priceNow);
    const hasDiscount = offer && (
      (offer.type === 'bundle'     && i.qty >= offer.minQuantity) ||
      (offer.type === 'percentage') ||
      (offer.type === 'fixed'      && i.qty >= (offer.minQuantity || 1))
    );

const thumb = i.images ? i.images[0] : (i.image || '');

    return `<div class="ci">
      ${thumb ? `<img src="${thumb}" alt="${i.name}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0;margin-right:10px;">` : ''}
      <div class="ci-name">
        ${i.name}<br>
        <small>${i.qty} x ${i.unit}</small>
        ${hasDiscount ? `<br><small style="color:#c9973a;font-weight:600">✨ ${offer.displayText} applied</small>` : ''}
      </div>

      <div class="ci-right">
        ${hasDiscount && unitPrice !== i.priceNow
          ? `<span style="text-decoration:line-through;color:#999;font-size:.9rem;margin-right:8px">£${(i.priceNow * i.qty).toFixed(2)}</span>`
          : ''}
        <strong>£${subtotal.toFixed(2)}</strong>
        <button onclick="removeFromCart('${i.id}')">×</button>
      </div>
    </div>`;
  }).join('');

  const grandTotal = cart.reduce((s, i) => s + calculatePrice(i.id, i.qty, i.priceNow), 0);
  
const FREE_DELIVERY_THRESHOLD = 40;
const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - grandTotal);
const progress = Math.min(100, (grandTotal / FREE_DELIVERY_THRESHOLD) * 100);

const deliveryBar = remaining > 0
  ? `<div class="dbar-wrap">
       <div class="dbar-msg">Add <strong>£${remaining.toFixed(2)}</strong> more for free UK delivery 🚚</div>
       <div class="dbar-track"><div class="dbar-fill" style="width:${progress}%"></div></div>
     </div>`
  : `<div class="dbar-wrap dbar-done">🎉 You've unlocked <strong>free UK delivery!</strong></div>`;

list.innerHTML = rows + deliveryBar + `<div class="ctotal">Total: <strong>£${grandTotal.toFixed(2)}</strong></div>`;


}

/* ---------- Cart Count Badge ---------- */

function updateCount() {
  const c  = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cart-count');
  el.textContent = c;
  el.className   = c > 0 ? 'cart-count show' : 'cart-count';
}

/* ---------- Open / Close Modal ---------- */

function openCart()  { document.getElementById('cart-modal').classList.add('open'); }
function closeCart() { document.getElementById('cart-modal').classList.remove('open'); }

/* ---------- Shared Form Values & Validation ---------- */

function getFormValues() {
  return {
    n:  document.getElementById('cust-name').value.trim(),
    e:  document.getElementById('cust-email').value.trim(),
    ph: document.getElementById('cust-phone').value.trim(),
    ad: document.getElementById('cust-address').value.trim(),
    pc: document.getElementById('cust-postcode').value.trim(),
    nt: document.getElementById('cust-note').value.trim(),
    dm: (document.querySelector('input[name="delivery"]:checked') || {}).value || 'delivery'
  };
}


function showError(fieldId, msg) {
  var field = document.getElementById(fieldId);
  var existing = field.parentNode.querySelector('.ferr');
  if (existing) existing.remove();
  var err = document.createElement('div');
  err.className = 'ferr';
  err.textContent = msg;
  field.parentNode.appendChild(err);
  field.style.borderColor = '#c0392b';
  field.focus();
}

function clearErrors() {
  document.querySelectorAll('.ferr').forEach(function(e){ e.remove(); });
  document.querySelectorAll('.modal input, .modal textarea').forEach(function(f){ f.style.borderColor = ''; });
}

function validateForm(v) {
  clearErrors();
  if (cart.length === 0) {
    var msg = document.createElement('div');
    msg.className = 'ferr';
    msg.style.textAlign = 'center';
    msg.textContent = 'Your bag is empty!';
    document.getElementById('cart-list').appendChild(msg);
    return false;
  }
  if (!v.n)  { showError('cust-name',     'Please enter your full name'); return false; }
  if (!v.e)  { showError('cust-email',    'Please enter your email address'); return false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.e)) { showError('cust-email', 'Please enter a valid email address'); return false; }
  if (!/^[0-9]{9,11}$/.test(v.ph.replace(/\s+/g,''))) { showError('cust-phone', 'Enter a valid UK number (9–11 digits after +44)'); return false; }
  if (!v.ad) { showError('cust-address',  'Please enter your delivery address'); return false; }
  if (!v.pc) { showError('cust-postcode', 'Please enter your postcode'); return false; }
  return true;
}



/* ---------- Stripe Card Checkout ---------- */

function validateAndCheckout() {
  const v = getFormValues();
  if (!validateForm(v)) return;

  const items = cart.map(i => ({
    name:  i.name,
    qty:   i.qty,
    label: i.qty + ' ' + i.unit,
    price: calculatePrice(i.id, i.qty, i.priceNow)
  }));

  const total = cart.reduce((s, i) => s + calculatePrice(i.id, i.qty, i.priceNow), 0);

  const data = {
    orderId:        'EG-' + Date.now(),
    deliveryMethod: v.dm,
    customer: { name: v.n, email: v.e, phone: '+44' + v.ph, address: v.ad, postcode: v.pc, note: v.nt },
    items:          items,
    total:          parseFloat(total.toFixed(2)),
    referralUsed:   null,
    timestamp:      new Date().toISOString()
  };

  fetch(CHECKOUT_API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data)
  })
  .then(res  => res.json())
  .then(resp => {
    if (resp && resp.url) {
      window.location.href = resp.url;
    } else {
      console.error('Unexpected response:', resp);
      alert('Sorry, could not start the payment. Please try again.');
    }
  })
  .catch(err => {
    console.error('Payment API error:', err);
    alert('Sorry, could not reach the payment server. Please try again.');
  });
}

/* ---------- WhatsApp Order ---------- */

function validateAndWhatsApp() {
  const v = getFormValues();
  if (!validateForm(v)) return;

  const itemsStr = cart.map(i => i.qty + 'x ' + i.name).join('%0A');
  const total    = cart.reduce((s, i) => s + calculatePrice(i.id, i.qty, i.priceNow), 0).toFixed(2);
  const msg      = 'Hi! New order from ' + v.n
    + '%0A%0A' + itemsStr
    + '%0A%0ATotal: £' + total
    + '%0APhone: +44'  + v.ph
    + '%0APostcode: '  + v.pc
    + '%0AAddress: '   + encodeURIComponent(v.ad);

  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + msg, '_blank');
}