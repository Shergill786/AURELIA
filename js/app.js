/* =========================================================
   app.js — Global site behaviour shared by every page
   ========================================================= */

/* ---------- Preloader ---------- */
window.addEventListener('load', ()=>{
  const pre = document.getElementById('preloader');
  if(pre){ setTimeout(()=> pre.classList.add('hide'), 400); }
});

/* ---------- Theme Toggle (persisted) ---------- */
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('aurelia_theme', theme);
}
(function initTheme(){
  const saved = localStorage.getItem('aurelia_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', ()=>{
  const toggle = document.getElementById('themeToggle');
  if(toggle){
    toggle.addEventListener('click', ()=>{
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- Sticky nav shadow ---------- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', ()=>{
    if(!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 10);

    /* ---------- Scroll progress bar ---------- */
    const progress = document.getElementById('scrollProgress');
    if(progress){
      const h = document.documentElement;
      const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      progress.style.width = pct + '%';
    }

    /* ---------- Scroll-to-top visibility ---------- */
    const stt = document.getElementById('scrollTop');
    if(stt) stt.classList.toggle('show', window.scrollY > 500);
  });

  document.getElementById('scrollTop')?.addEventListener('click', ()=>{
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  /* ---------- Mobile nav drawer ---------- */
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.getElementById('navDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  function openDrawer(){ drawer?.classList.add('open'); drawerOverlay?.classList.add('show'); }
  function closeDrawer(){ drawer?.classList.remove('open'); drawerOverlay?.classList.remove('show'); }
  hamburger?.addEventListener('click', openDrawer);
  document.querySelector('.nav-drawer-close')?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  /* ---------- Ripple effect on all .ripple buttons ---------- */
  document.querySelectorAll('.ripple').forEach(btn=>{
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size/2) + 'px';
      circle.style.top = (e.clientY - rect.top - size/2) + 'px';
      this.appendChild(circle);
      setTimeout(()=> circle.remove(), 650);
    });
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-counter[data-count]');
  const counterIO = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      let cur = 0;
      const step = Math.max(1, target/60);
      const tick = ()=>{
        cur += step;
        if(cur >= target){ el.textContent = target.toLocaleString() + (el.dataset.suffix||''); return; }
        el.textContent = Math.floor(cur).toLocaleString() + (el.dataset.suffix||'');
        requestAnimationFrame(tick);
      };
      tick();
      counterIO.unobserve(el);
    });
  }, { threshold:0.5 });
  counters.forEach(c=> counterIO.observe(c));

  /* ---------- Flash sale countdown ---------- */
  const countdownEl = document.getElementById('flashCountdown');
  if(countdownEl){
    let target = localStorage.getItem('aurelia_flash_end');
    if(!target || +target < Date.now()){
      target = Date.now() + (6*3600 + 24*60 + 10) * 1000; // ~6h24m from now
      localStorage.setItem('aurelia_flash_end', target);
    }
    const tick = ()=>{
      let diff = Math.max(0, target - Date.now());
      const h = String(Math.floor(diff/3600000)).padStart(2,'0');
      const m = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
      const s = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
      countdownEl.querySelector('.h').textContent = h;
      countdownEl.querySelector('.m').textContent = m;
      countdownEl.querySelector('.s').textContent = s;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Typing effect on hero headline ---------- */
  const typeTarget = document.getElementById('typeText');
  if(typeTarget){
    const words = JSON.parse(typeTarget.dataset.words || '[]');
    let wi=0, ci=0, deleting=false;
    function typeLoop(){
      const word = words[wi];
      typeTarget.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
      let delay = deleting ? 45 : 90;
      if(!deleting && ci === word.length+1){ delay = 1400; deleting = true; }
      if(deleting && ci === 0){ deleting=false; wi = (wi+1)%words.length; delay=400; }
      setTimeout(typeLoop, delay);
    }
    typeLoop();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(q=>{
    q.addEventListener('click', ()=>{
      q.parentElement.classList.toggle('open');
    });
  });

  /* ---------- Modal close on outside click ---------- */
  document.querySelectorAll('.modal-overlay').forEach(ov=>{
    ov.addEventListener('click', (e)=>{ if(e.target === ov) ov.classList.remove('show'); });
  });

  updateNavBadges?.();
});

/* Highlight active nav link */
document.addEventListener('DOMContentLoaded', ()=>{
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a=>{
    if(a.getAttribute('href') === page) a.classList.add('active');
  });
});
