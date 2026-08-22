/* =========================================================
   login.js — Login & Signup form validation
   ========================================================= */

function toggleFieldError(input, valid, msgText){
  const field = input.closest('.auth-field') || input.closest('.field');
  field.classList.toggle('invalid', !valid);
  const msg = field.querySelector('.error-msg');
  if(msg && msgText) msg.textContent = msgText;
  return valid;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.addEventListener('DOMContentLoaded', ()=>{

  /* ---------- Show / Hide password ---------- */
  document.querySelectorAll('.toggle-pass').forEach(icon=>{
    icon.addEventListener('click', ()=>{
      const input = icon.previousElementSibling;
      if(input.type === 'password'){ input.type='text'; icon.textContent='🙈'; }
      else{ input.type='password'; icon.textContent='👁'; }
    });
  });

  /* ---------- Password strength meter ---------- */
  const pwInput = document.getElementById('signupPassword');
  if(pwInput){
    pwInput.addEventListener('input', ()=>{
      const val = pwInput.value;
      let score = 0;
      if(val.length >= 8) score++;
      if(/[A-Z]/.test(val)) score++;
      if(/[0-9]/.test(val)) score++;
      if(/[^A-Za-z0-9]/.test(val)) score++;
      const bar = document.querySelector('.strength-meter i');
      if(bar){
        const pct = (score/4)*100;
        bar.style.width = pct + '%';
        bar.style.background = score<=1 ? '#d9534f' : score===2 ? '#e0a530' : score===3 ? '#a3c94f' : '#3fbf7f';
      }
    });
  }

  /* ---------- Login form ---------- */
  const loginForm = document.getElementById('loginForm');
  loginForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail');
    const pass = document.getElementById('loginPassword');
    let valid = true;
    valid = toggleFieldError(email, EMAIL_RE.test(email.value.trim()), 'Enter a valid email address') && valid;
    valid = toggleFieldError(pass, pass.value.length >= 6, 'Password must be at least 6 characters') && valid;

    if(!valid) return;

    if(document.getElementById('rememberMe')?.checked){
      localStorage.setItem('aurelia_remember_email', email.value.trim());
    }
    const btn = loginForm.querySelector('button[type="submit"]');
    btn.textContent = 'Signing in...';
    setTimeout(()=>{ window.location.href = 'home.html'; }, 900);
  });

  // Prefill remembered email
  const rememberedEmail = localStorage.getItem('aurelia_remember_email');
  const loginEmailInput = document.getElementById('loginEmail');
  if(rememberedEmail && loginEmailInput){
    loginEmailInput.value = rememberedEmail;
    const rm = document.getElementById('rememberMe');
    if(rm) rm.checked = true;
  }

  /* ---------- Signup form ---------- */
  const signupForm = document.getElementById('signupForm');
  signupForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('signupName');
    const email = document.getElementById('signupEmail');
    const pass = document.getElementById('signupPassword');
    const confirm = document.getElementById('signupConfirm');
    const terms = document.getElementById('agreeTerms');
    let valid = true;
    valid = toggleFieldError(name, name.value.trim().length >= 2, 'Enter your full name') && valid;
    valid = toggleFieldError(email, EMAIL_RE.test(email.value.trim()), 'Enter a valid email address') && valid;
    valid = toggleFieldError(pass, pass.value.length >= 8, 'Password must be at least 8 characters') && valid;
    valid = toggleFieldError(confirm, confirm.value === pass.value && confirm.value.length>0, 'Passwords do not match') && valid;
    if(terms && !terms.checked){
      showToast?.('Please accept the Terms & Conditions','error');
      valid = false;
    }
    if(!valid) return;

    const btn = signupForm.querySelector('button[type="submit"]');
    btn.textContent = 'Creating account...';
    setTimeout(()=>{ window.location.href = 'login.html'; }, 900);
  });

  /* ---------- Forgot password (demo) ---------- */
  document.getElementById('forgotPasswordLink')?.addEventListener('click', (e)=>{
    e.preventDefault();
    const email = prompt('Enter your account email to receive a reset link:');
    if(email && EMAIL_RE.test(email)){
      alert(`A password reset link has been sent to ${email}.`);
    } else if(email){
      alert('Please enter a valid email address.');
    }
  });
});
