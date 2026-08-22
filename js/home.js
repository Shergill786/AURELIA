document.addEventListener('DOMContentLoaded', ()=> {
  const trendingSlider = document.getElementById('trendingSlider');
  const newArrivalsSlider = document.getElementById('newArrivalsSlider');
  const flashSaleSlider = document.getElementById('flashSaleSlider');

  if (trendingSlider) {
    trendingSlider.innerHTML = PRODUCTS.slice(0, 10).map(productCardHTML).join('');
  }
  if (newArrivalsSlider) {
    newArrivalsSlider.innerHTML = PRODUCTS.slice().reverse().slice(0, 8).map(productCardHTML).join('');
  }
  if (flashSaleSlider) {
    flashSaleSlider.innerHTML = PRODUCTS.filter((p)=> p.oldPrice - p.price >= 30).map(productCardHTML).join('');
  }
});
