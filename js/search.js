/* =========================================================
   search.js — Live search (navbar) + Products page filter/sort
   ========================================================= */

document.addEventListener('DOMContentLoaded', ()=>{

  /* ---------- Navbar live search suggestions ---------- */
  const navSearchInput = document.getElementById('navSearchInput');
  const suggestBox = document.getElementById('searchSuggestions');
  if(navSearchInput && suggestBox){
    navSearchInput.addEventListener('input', ()=>{
      const q = navSearchInput.value.trim().toLowerCase();
      if(q.length < 1){ suggestBox.style.display='none'; return; }
      const matches = PRODUCTS.filter(p=> p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.section.toLowerCase().includes(q) || (p.type||'').toLowerCase().includes(q)).slice(0,6);
      if(matches.length === 0){ suggestBox.innerHTML = `<a>No matches found</a>`; }
      else{
        suggestBox.innerHTML = matches.map(p=> `<a href="product.html?id=${p.id}"><span>${p.name}</span><span style="color:var(--text-dim)">₹${p.price}</span></a>`).join('');
      }
      suggestBox.style.display = 'block';
    });
    document.addEventListener('click', (e)=>{
      if(!navSearchInput.contains(e.target) && !suggestBox.contains(e.target)) suggestBox.style.display='none';
    });
    navSearchInput.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){
        window.location.href = `products.html?search=${encodeURIComponent(navSearchInput.value.trim())}`;
      }
    });
  }

  /* ---------- Products Page: filter / sort / search state ---------- */
  const grid = document.getElementById('productsGrid');
  if(!grid) return;

  const params = new URLSearchParams(window.location.search);
  const state = {
    search: params.get('search') || '',
    sections: [],
    types: [],
    brands: [],
    rating: 0,
    maxPrice: 10000,
    sort: 'featured'
  };
  if(params.get('section')) state.sections = [params.get('section')];
  if(params.get('cat')) state.sections = [params.get('cat')]; // backwards-compatible with old ?cat= links
  if(params.get('type')) state.types = [params.get('type')];

  const searchOnPage = document.getElementById('pageSearchInput');
  if(searchOnPage) searchOnPage.value = state.search;

  function applyFilters(){
    let list = PRODUCTS.slice();

    if(state.search){
      const q = state.search.toLowerCase();
      list = list.filter(p=> p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.section.toLowerCase().includes(q) || (p.type||'').toLowerCase().includes(q));
    }
    if(state.sections.length){
      list = list.filter(p=> state.sections.includes(p.section));
    }
    if(state.types.length){
      list = list.filter(p=> state.types.includes(p.type));
    }
    if(state.brands.length){
      list = list.filter(p=> state.brands.includes(p.brand));
    }
    if(state.rating > 0){
      list = list.filter(p=> p.rating >= state.rating);
    }
    list = list.filter(p=> p.price <= state.maxPrice);

    switch(state.sort){
      case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
      case 'newest': list.sort((a,b)=>b.id-a.id); break;
      case 'rating': list.sort((a,b)=>b.rating-a.rating); break;
      default: break; // featured = catalogue order
    }

    renderGrid('productsGrid', list);
    const countEl = document.getElementById('resultCount');
    if(countEl) countEl.textContent = `${list.length} product${list.length!==1?'s':''} found`;
  }

  // Search input (page toolbar)
  searchOnPage?.addEventListener('input', ()=>{
    state.search = searchOnPage.value.trim();
    applyFilters();
  });

  // Section checkboxes
  document.querySelectorAll('.filter-section').forEach(cb=>{
    if(state.sections.includes(cb.value)) cb.checked = true;
    cb.addEventListener('change', ()=>{
      state.sections = [...document.querySelectorAll('.filter-section:checked')].map(c=>c.value);
      applyFilters();
    });
  });

  // Type checkboxes
  document.querySelectorAll('.filter-type').forEach(cb=>{
    if(state.types.includes(cb.value)) cb.checked = true;
    cb.addEventListener('change', ()=>{
      state.types = [...document.querySelectorAll('.filter-type:checked')].map(c=>c.value);
      applyFilters();
    });
  });

  // Brand checkboxes
  document.querySelectorAll('.filter-brand').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      state.brands = [...document.querySelectorAll('.filter-brand:checked')].map(c=>c.value);
      applyFilters();
    });
  });

  // Rating radio
  document.querySelectorAll('.filter-rating').forEach(r=>{
    r.addEventListener('change', ()=>{
      state.rating = +r.value;
      applyFilters();
    });
  });

  // Price range
  const priceRange = document.getElementById('priceRange');
  if(priceRange){
    priceRange.addEventListener('input', ()=>{
      state.maxPrice = +priceRange.value;
      document.getElementById('priceMaxLabel').textContent = '₹'+state.maxPrice;
      applyFilters();
    });
  }

  // Sort select
  document.getElementById('sortSelect')?.addEventListener('change', (e)=>{
    state.sort = e.target.value;
    applyFilters();
  });

  // Clear filters
  document.getElementById('clearFiltersBtn')?.addEventListener('click', ()=>{
    state.sections = []; state.types = []; state.brands = []; state.rating = 0; state.maxPrice = 10000; state.search=''; state.sort='featured';
    document.querySelectorAll('.filter-section, .filter-type, .filter-brand').forEach(c=>c.checked=false);
    document.querySelectorAll('.filter-rating').forEach(r=>r.checked=false);
    if(priceRange){ priceRange.value = 10000; document.getElementById('priceMaxLabel').textContent = '₹10000'; }
    if(searchOnPage) searchOnPage.value = '';
    applyFilters();
  });

  applyFilters();
});
