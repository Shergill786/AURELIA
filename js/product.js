document.addEventListener('DOMContentLoaded', ()=> {
  const id = +new URLSearchParams(location.search).get('id') || PRODUCTS[0].id;
  const p = PRODUCTS.find((pr)=> pr.id === id) || PRODUCTS[0];

  document.getElementById('pageTitle').textContent = p.name + ' — Aurelia';
  document.getElementById('crumbName').textContent = p.name;
  document.getElementById('pdMainImage').src = p.img;
  document.getElementById('pdMainImage').alt = p.name;
  document.getElementById('pdCat').textContent = p.section + ' · ' + (p.type || p.cat) + ' · ' + p.brand;
  document.getElementById('pdTitle').textContent = p.name;
  document.getElementById('pdRating').innerHTML = `★★★★★ <span>${p.rating} (${p.reviews} reviews)</span>`;
  document.getElementById('pdPrice').textContent = '₹' + p.price;
  document.getElementById('pdOldPrice').textContent = '₹' + p.oldPrice;
  document.getElementById('pdOff').textContent = Math.round((1 - p.price / p.oldPrice) * 100) + '% OFF';
  document.getElementById('pdDesc').textContent = p.desc;
  document.getElementById('tabDescText').textContent = p.desc + ' Every Aurelia piece is quality-checked twice before it ships, so what arrives at your door matches exactly what you saw on screen.';
  document.getElementById('specBrand').textContent = p.brand;
  document.getElementById('specSection').textContent = p.section;
  document.getElementById('specType').textContent = p.type || p.cat;
  document.getElementById('specCat').textContent = p.cat;

  document.getElementById('pdThumbs').innerHTML = [p.img, p.img, p.img].map((src, i)=> `<img src="${src}" class="${i === 0 ? 'active' : ''}">`).join('');
  document.getElementById('pdSwatches').innerHTML = p.colors.map((c, i)=> `<div class="swatch ${i === 0 ? 'active' : ''}" style="background:${c}"></div>`).join('');
  document.getElementById('pdSizes').innerHTML = p.sizes.map((s, i)=> `<div class="size-pill ${i === 0 ? 'active' : ''}">${s}</div>`).join('');

  const wishBtn = document.getElementById('pdWishBtn');
  const syncWishState = ()=> {
    const inWish = getWishlist().includes(p.id);
    wishBtn.textContent = inWish ? '♥ Wishlisted' : '♡ Wishlist';
  };
  syncWishState();
  wishBtn.addEventListener('click', ()=> {
    toggleWishlist(p.id);
    syncWishState();
  });

  document.getElementById('pdAddCart').addEventListener('click', ()=> {
    const qty = +document.getElementById('pdQty').value;
    addToCart(p.id, qty);
  });

  document.getElementById('pdBuyNow').addEventListener('click', ()=> {
    const qty = +document.getElementById('pdQty').value;
    addToCart(p.id, qty);
    window.location.href = 'cart.html';
  });

  const sameType = PRODUCTS.filter((pr)=> pr.section === p.section && pr.type === p.type && pr.id !== p.id);
  const sameSection = PRODUCTS.filter((pr)=> pr.section === p.section && pr.id !== p.id && !sameType.includes(pr));
  const related = [...sameType, ...sameSection].slice(0, 4);
  renderGrid('relatedGrid', related.length ? related : PRODUCTS.filter((pr)=> pr.id !== p.id).slice(0, 4));
});
