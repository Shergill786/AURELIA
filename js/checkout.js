document.addEventListener('DOMContentLoaded', ()=> {
  document.querySelectorAll('#payMethods .pay-method').forEach((method)=> {
    method.addEventListener('click', ()=> {
      document.querySelectorAll('#payMethods .pay-method').forEach((item)=> item.classList.remove('active'));
      method.classList.add('active');
      method.querySelector('input[type="radio"]').checked = true;
    });
  });
});
