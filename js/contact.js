document.addEventListener('DOMContentLoaded', ()=> {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e)=> {
    e.preventDefault();
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const subject = document.getElementById('contactSubject');
    const message = document.getElementById('contactMessage');
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;

    const setValid = (input, ok)=> {
      input.closest('.field').classList.toggle('invalid', !ok);
      return ok;
    };

    valid = setValid(name, name.value.trim().length > 1) && valid;
    valid = setValid(email, EMAIL_RE.test(email.value.trim())) && valid;
    valid = setValid(subject, subject.value.trim().length > 1) && valid;
    valid = setValid(message, message.value.trim().length > 4) && valid;

    if (!valid) {
      showToast('Please complete the required fields', 'error');
      const firstInvalid = e.target.querySelector('.field.invalid input, .field.invalid textarea');
      firstInvalid?.focus();
      return;
    }

    showToast('Message sent — we\'ll be in touch soon!');
    e.target.reset();
  });

  document.querySelectorAll('#contactForm .field input, #contactForm .field textarea').forEach((el)=> {
    el.addEventListener('input', ()=> el.closest('.field').classList.remove('invalid'));
  });
});
