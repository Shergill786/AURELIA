/* =========================================================
   slider.js — Hero auto slider, horizontal carousels, PDP gallery
   ========================================================= */

document.addEventListener('DOMContentLoaded', ()=>{

  /* ---------- Hero auto image slider ---------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dots button');
  if(heroSlides.length){
    let current = 0;
    function showSlide(i){
      heroSlides.forEach(s=>s.classList.remove('active'));
      heroDots.forEach(d=>d.classList.remove('active'));
      heroSlides[i].classList.add('active');
      heroDots[i]?.classList.add('active');
      current = i;
    }
    showSlide(0);
    let heroTimer = setInterval(()=> showSlide((current+1)%heroSlides.length), 4500);
    heroDots.forEach((dot,i)=> dot.addEventListener('click', ()=>{
      clearInterval(heroTimer);
      showSlide(i);
      heroTimer = setInterval(()=> showSlide((current+1)%heroSlides.length), 4500);
    }));
  }

  /* ---------- Horizontal slider nav buttons ---------- */
  document.querySelectorAll('.hslider-wrap').forEach(wrap=>{
    const track = wrap.querySelector('.hslider');
    wrap.querySelector('.prev')?.addEventListener('click', ()=> track.scrollBy({left:-300, behavior:'smooth'}));
    wrap.querySelector('.next')?.addEventListener('click', ()=> track.scrollBy({left:300, behavior:'smooth'}));
  });

  /* ---------- Product detail gallery (zoom + thumbnails) ---------- */
  const pdMain = document.getElementById('pdMainImage');
  if(pdMain){
    pdMain.parentElement.addEventListener('click', function(){
      this.classList.toggle('zoomed');
    });
    pdMain.parentElement.addEventListener('mousemove', function(e){
      if(!this.classList.contains('zoomed')) return;
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left)/rect.width)*100;
      const y = ((e.clientY - rect.top)/rect.height)*100;
      pdMain.style.transformOrigin = `${x}% ${y}%`;
    });
    document.querySelectorAll('.pd-thumbs img').forEach(thumb=>{
      thumb.addEventListener('click', ()=>{
        document.querySelectorAll('.pd-thumbs img').forEach(t=>t.classList.remove('active'));
        thumb.classList.add('active');
        pdMain.src = thumb.src;
      });
    });
  }

  /* ---------- PDP tabs ---------- */
  document.querySelectorAll('.pd-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.pd-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.pd-tab-panel').forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab)?.classList.add('active');
    });
  });

  /* ---------- PDP swatches / sizes / qty ---------- */
  document.querySelectorAll('.swatch').forEach(sw=>{
    sw.addEventListener('click', ()=>{
      document.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));
      sw.classList.add('active');
    });
  });
  document.querySelectorAll('.size-pill').forEach(sp=>{
    sp.addEventListener('click', ()=>{
      document.querySelectorAll('.size-pill').forEach(s=>s.classList.remove('active'));
      sp.classList.add('active');
    });
  });
  const qtyInput = document.getElementById('pdQty');
  document.getElementById('qtyMinus')?.addEventListener('click', ()=>{
    qtyInput.value = Math.max(1, +qtyInput.value - 1);
  });
  document.getElementById('qtyPlus')?.addEventListener('click', ()=>{
    qtyInput.value = +qtyInput.value + 1;
  });
});
