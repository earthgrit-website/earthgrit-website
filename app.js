/* ============================================================
   EarthGrit – app.js
   Handles: building product cards, image carousel, reviews display
   Called last — after offers.js, products.js, reviews.js, cart.js
============================================================ */

var HERO_SLIDES = [];
var HERO_INTERVAL = 4500;

/* ---------- Hero Slideshow Logic ---------- */
function initHeroSlideshow() {
  if (!HERO_SLIDES.length) return;
  const circle = document.querySelector('.hcircle');
  if (!circle) return;
  const existingLogo = circle.querySelector('img');
  const logoSrc = existingLogo ? existingLogo.src : 'logo.jpg';
  circle.innerHTML = `
    <div style="position:relative;width:100%;height:100%;border-radius:50%;overflow:hidden;">
      <div id="hero-slides" style="position:absolute;inset:0;border-radius:50%;">
        ${HERO_SLIDES.map((src, idx) => `
          <img src="${src}" alt="EarthGrit slide"
               style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
                      transition:opacity 0.8s ease;opacity:${idx === 0 ? '1' : '0'};">
        `).join('')}
      </div>
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.2);border-radius:50%;z-index:1;"></div>
      <img src="${logoSrc}" alt="EarthGrit"
           style="position:absolute;inset:0;width:100%;height:100%;
                  object-fit:cover;border-radius:50%;opacity:0.25;z-index:2;">
    </div>`;
  let current = 0;
  const imgs = circle.querySelectorAll('#hero-slides img');
  setInterval(() => {
    imgs[current].style.opacity = '0';
    current = (current + 1) % imgs.length;
    imgs[current].style.opacity = '1';
  }, HERO_INTERVAL);
}

/* ---------- Image Carousel State ---------- */
let currentImages = {};

function changeImage(productId, direction) {
  const carousel = document.getElementById(`carousel-${productId}`);
  const images   = carousel.querySelectorAll('img');
  const dots     = document.querySelectorAll(`.dot-${productId}`);
  if (!currentImages[productId]) currentImages[productId] = 0;
  images[currentImages[productId]].style.display = 'none';
  if (dots[currentImages[productId]]) dots[currentImages[productId]].style.background = 'rgba(255,255,255,0.5)';
  currentImages[productId] = (currentImages[productId] + direction + images.length) % images.length;
  images[currentImages[productId]].style.display = 'block';
  if (dots[currentImages[productId]]) dots[currentImages[productId]].style.background = '#fff';
}

function setImage(productId, index) {
  const carousel = document.getElementById(`carousel-${productId}`);
  const images   = carousel.querySelectorAll('img');
  const dots     = document.querySelectorAll(`.dot-${productId}`);
  images.forEach((img, idx) => { img.style.display = idx === index ? 'block' : 'none'; });
  dots.forEach((dot, idx)   => { dot.style.background = idx === index ? '#fff' : 'rgba(255,255,255,0.5)'; });
  currentImages[productId] = index;
}

/* ---------- Auto-detect product images by base name ---------- */
function getProductImages(base, callback) {
  const imgs = [];
  let i = 1;
  function tryNext() {
    const filename = i === 1 ? base + ".jpg" : base + i + ".jpg";
    const img = new Image();
    img.onload = function() { imgs.push(filename); i++; tryNext(); };
    img.onerror = function() { callback(imgs.length ? imgs : [base + ".jpg"]); };
    img.src = filename;
  }
  tryNext();
}

/* ---------- Build Image HTML ---------- */
function buildImageHTML(p, images) {
  if (images.length > 1) {
    return `
      <div class="pi" style="position:relative;">
        <div id="carousel-${p.id}">
          ${images.map((img, idx) => `
            <img src="${img}" alt="${p.name}"
                 onclick="openLB(this.dataset.imgs.split('|'),${idx})" data-imgs="${images.join('|')}"
                 style="width:100%;height:100%;object-fit:cover;display:${idx === 0 ? 'block' : 'none'};position:absolute;top:0;left:0;cursor:zoom-in;">
          `).join('')}
        </div>
        <button onclick="changeImage('${p.id}',-1)"
                style="position:absolute;left:8px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.9);border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:1.2rem;z-index:10;">&#8249;</button>
        <button onclick="changeImage('${p.id}',1)"
                style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.9);border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:1.2rem;z-index:10;">&#8250;</button>
        <div style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:10;">
          ${images.map((_, idx) => `
            <span class="dot-${p.id}" onclick="setImage('${p.id}',${idx})"
                  style="width:8px;height:8px;border-radius:50%;background:${idx === 0 ? '#fff' : 'rgba(255,255,255,0.5)'};cursor:pointer;display:inline-block;"></span>
          `).join('')}
        </div>
        <div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.45);border-radius:6px;padding:3px 7px;color:#fff;font-size:.7rem;z-index:10;pointer-events:none;">🔍 Tap to zoom</div>
      </div>`;
  }
  return `
    <div class="pi" style="position:relative;">
      <img src="${images[0]}" alt="${p.name}"
           onclick="openLB(this.dataset.imgs.split('|'),0)" data-imgs="${images.join('|')}"
           style="width:100%;height:100%;object-fit:cover;cursor:zoom-in;">
      <div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.45);border-radius:6px;padding:3px 7px;color:#fff;font-size:.7rem;pointer-events:none;">🔍 Tap to zoom</div>
    </div>`;
}

/* ---------- Build Card HTML ---------- */
function buildCardHTML(p, images) {
  const offer        = getOffer(p.id);
  const displayBadge = offer?.badgeText   || p.badge     || '';
  const displayNote  = offer?.displayText || p.priceNote || '';
  return `
    <div class="pc">
      ${displayBadge ? `<div class="pb">${displayBadge}</div>` : ''}
      ${buildImageHTML(p, images)}
      <div class="pb2">
        <div class="pn">${p.name}</div>
        <div class="pt">${p.tagline}</div>
        <div class="pp">
          <span class="pn2">£${p.priceNow}</span>
          ${p.priceWas ? `<span class="pw">£${p.priceWas}</span>` : ''}
        </div>
        <div class="ppn">${displayNote}</div>
        ${p.extraNote ? `<div class="pen">✨ ${p.extraNote}</div>` : ''}
        <details class="pd">
          <summary>📋 Description</summary>
          <div class="pdd"><p>${p.description}</p></div>
        </details>
        <details class="pd">
          <summary>🌿 Ingredients</summary>
          <div class="pdd"><p>${p.ingredients}</p></div>
        </details>
        ${p.nutrition ? `
        <details class="pd">
          <summary>📊 Nutrition</summary>
          <div class="pdd"><p>${p.nutrition}</p></div>
        </details>` : ''}
        <div class="pf">
          <div class="qr">
            <span class="ql">Qty:</span>
            <div class="qc">
              <button class="qb" onclick="this.nextElementSibling.value=Math.max(1,this.nextElementSibling.value-1)">-</button>
              <input class="qi" id="q-${p.id}" type="number" value="1" min="1">
              <button class="qb" onclick="this.previousElementSibling.value=++this.previousElementSibling.value">+</button>
            </div>
          </div>
          <button class="acb"
            onclick="addToCart('${p.id}',+document.getElementById('q-${p.id}').value);this.textContent='Added ✓';setTimeout(()=>this.textContent='Add to Bag',1500)">
            Add to Bag
          </button>
        </div>
      </div>
    </div>`;
}

/* ---------- Build Single Product Card ---------- */
function buildProductCard(p, callback) {
  if (p.imageBase) {
    getProductImages(p.imageBase, function(images) {
      callback(buildCardHTML(p, images));
    });
  } else {
    const images = Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []);
    callback(buildCardHTML(p, images));
  }
}

/* ---------- Build All Products ---------- */
function buildProducts() {
  const container = document.getElementById('pg');
  container.innerHTML = '';
  let built = 0;
  const cards = new Array(PRODUCTS.length);
  PRODUCTS.forEach(function(p, idx) {
    buildProductCard(p, function(cardHTML) {
      cards[idx] = cardHTML;
      built++;
      if (built === PRODUCTS.length) {
        container.innerHTML = cards.join('');
      }
    });
  });
}

/* ---------- Display 4 Random 5-Star Reviews ---------- */
function displayRandomReviews() {
  if (typeof REVIEWS === 'undefined' || !REVIEWS.length) return;
  const selected = REVIEWS
    .filter(r => r.stars === 5)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
  document.getElementById('reviews-container').innerHTML = selected.map(r => `
    <div class="rc">
      <div class="rs">${'⭐'.repeat(r.stars)}</div>
      <p class="rt">"${r.text}"</p>
      <div class="ra">${r.author} <small style="color:#888;font-weight:normal">(${r.source})</small></div>
    </div>
  `).join('');
}

/* ---------- Mobile Menu ---------- */
function toggleMenu() {
  var menu = document.getElementById('mmenu');
  var btn  = document.getElementById('hbtn');
  var isOpen = menu.style.display === 'flex';
  if (isOpen) {
    menu.style.display = 'none';
    document.body.style.overflow = '';
    var spans = btn.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  } else {
    menu.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    var spans = btn.querySelectorAll('span');
    spans[0].style.transform = 'translateY(8.75px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-8.75px) rotate(-45deg)';
  }
}

(function() {
  var btn = document.getElementById('hbtn');
  if (window.innerWidth <= 768) btn.style.display = 'flex';
  window.addEventListener('resize', function() {
    btn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
  });
})();

/* ============================================================
   LIGHTBOX
============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  var lb = document.createElement('div');
  lb.id = 'lb';
  lb.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999;flex-direction:column;align-items:center;justify-content:center;';
  lb.innerHTML = `
    <button onclick="closeLB()" style="position:absolute;top:16px;right:20px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;z-index:2;line-height:1;">&#x2715;</button>
    <button id="lb-prev" onclick="lbNav(-1)" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.15);border:none;color:#fff;font-size:1.8rem;cursor:pointer;border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">‹</button>
    <img id="lb-img" src="" alt="" style="max-width:92vw;max-height:80vh;border-radius:12px;object-fit:contain;box-shadow:0 8px 40px rgba(0,0,0,.5);">
    <div id="lb-dots" style="display:flex;gap:8px;margin-top:16px;"></div>
    <button id="lb-next" onclick="lbNav(1)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.15);border:none;color:#fff;font-size:1.8rem;cursor:pointer;border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">›</button>
  `;
  lb.addEventListener('click', function(e){ if(e.target===lb) closeLB(); });
  document.body.appendChild(lb);
});

var LB_IMGS = [], LB_IDX = 0;

function openLB(imgs, idx) {
  LB_IMGS = Array.isArray(imgs) ? imgs : [imgs];
  LB_IDX = idx || 0;
  var lb = document.getElementById('lb');
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  lbRender();
}
function closeLB() {
  document.getElementById('lb').style.display = 'none';
  document.body.style.overflow = '';
}
function lbNav(dir) {
  LB_IDX = (LB_IDX + dir + LB_IMGS.length) % LB_IMGS.length;
  lbRender();
}
function lbRender() {
  document.getElementById('lb-img').src = LB_IMGS[LB_IDX];
  var showNav = LB_IMGS.length > 1;
  document.getElementById('lb-prev').style.display = showNav ? 'flex' : 'none';
  document.getElementById('lb-next').style.display = showNav ? 'flex' : 'none';
  var dots = document.getElementById('lb-dots');
  dots.innerHTML = LB_IMGS.length > 1 ? LB_IMGS.map(function(_,i){
    return '<div style="width:8px;height:8px;border-radius:50%;background:'+(i===LB_IDX?'#fff':'rgba(255,255,255,.4)')+'"></div>';
  }).join('') : '';
}

document.addEventListener('keydown', function(e){
  var lb = document.getElementById('lb');
  if (!lb || lb.style.display === 'none') return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowLeft') lbNav(-1);
  if (e.key === 'ArrowRight') lbNav(1);
});

(function(){
  var startX = 0;
  document.addEventListener('touchstart', function(e){
    if(document.getElementById('lb').style.display==='flex') startX = e.touches[0].clientX;
  });
  document.addEventListener('touchend', function(e){
    if(document.getElementById('lb').style.display!=='flex') return;
    var diff = startX - e.changedTouches[0].clientX;
    if(Math.abs(diff) > 50) lbNav(diff > 0 ? 1 : -1);
  });
})();

/* ---------- Initialise on Load ---------- */
buildProducts();
displayRandomReviews();
initHeroSlideshow();

/* ============================================================
   Stockist Finder
============================================================ */
function haversineDistance(lat1, lng1, lat2, lng2) {
  var R = 3958.8;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function findStockists() {
  var input = document.getElementById('stockist-postcode').value.trim().toUpperCase().replace(/\s+/g, '');
  var resultsDiv = document.getElementById('stockist-results');
  if (!input) {
    resultsDiv.innerHTML = '<p style="color:#c0392b;font-weight:600;">⚠️ Please enter a postcode.</p>';
    return;
  }
  if (typeof STOCKISTS === 'undefined' || !STOCKISTS.length) {
    resultsDiv.innerHTML = '<p style="color:#c0392b;">No stockists found. Please try again later.</p>';
    return;
  }
  resultsDiv.innerHTML = '<p style="color:#555;">🔍 Searching...</p>';
  var formatted = input.length > 3 ? input.slice(0, -3) + ' ' + input.slice(-3) : input;
  fetch('https://api.postcodes.io/postcodes/' + encodeURIComponent(formatted))
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.status === 200 && data.result) {
        var userLat = data.result.latitude;
        var userLng = data.result.longitude;
        var sorted = STOCKISTS.map(function(s) {
          var dist = haversineDistance(userLat, userLng, s.lat, s.lng);
          return Object.assign({}, s, { distance: dist });
        }).sort(function(a, b) { return a.distance - b.distance; });
        renderStockists(resultsDiv, sorted, true);
      } else {
        renderStockists(resultsDiv, STOCKISTS, false);
      }
    })
    .catch(function() {
      renderStockists(resultsDiv, STOCKISTS, false);
    });
}

function renderStockists(resultsDiv, stockists, sorted) {
  var heading = sorted
    ? '📍 EarthGrit stockists — nearest first:'
    : '📍 EarthGrit stockists (Milton Keynes area):';
  var html = '<p style="margin-bottom:12px;font-weight:600;color:#2d5a27;">' + heading + '</p>';
  html += '<div style="display:flex;flex-direction:column;gap:14px;">';
  stockists.forEach(function(s) {
    var mapsUrl = 'https://maps.google.com/?q=' + encodeURIComponent(s.address + ' ' + s.postcode);
    var distLabel = s.distance !== undefined
      ? ' <span style="font-size:0.8rem;color:#888;font-weight:400;">(' + s.distance.toFixed(1) + ' miles away)</span>'
      : '';
    html += '<div style="background:#fff;border:1px solid #e8e0d5;border-radius:12px;padding:16px;">';
    html += '<div style="font-weight:700;font-size:1rem;color:#2d5a27;margin-bottom:4px;">📍 ' + s.name + distLabel + '</div>';
    html += '<div style="color:#555;font-size:0.9rem;margin-bottom:2px;">' + s.address + '</div>';
    html += '<div style="color:#555;font-size:0.9rem;margin-bottom:4px;">' + s.postcode + '</div>';
    if (s.phone) html += '<div style="color:#555;font-size:0.9rem;margin-bottom:4px;">📞 ' + s.phone + '</div>';
    if (s.notes) html += '<div style="color:#2d7a3a;font-size:0.85rem;margin-bottom:8px;">✅ ' + s.notes + '</div>';
    html += '<a href="' + mapsUrl + '" target="_blank" style="display:inline-block;background:#c8a84b;color:#fff;padding:7px 16px;border-radius:20px;font-size:0.85rem;font-weight:600;text-decoration:none;">🗺 Get Directions →</a>';
    html += '</div>';
  });
  html += '</div>';
  resultsDiv.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  var inp = document.getElementById('stockist-postcode');
  if (inp) inp.addEventListener('keypress', function(e){
    if (e.key === 'Enter') findStockists();
  });
});
