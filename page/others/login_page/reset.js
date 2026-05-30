const resetForm = document.getElementById('resetForm');
const emailInput = document.getElementById('resetEmail');
const fgEmail    = document.getElementById('fg-email');
const errEmail   = document.getElementById('err-email');
const resetBtn   = document.getElementById('resetBtn');
const toastEl    = document.getElementById('toast');

function showToast(msg, type = 'success') {
  toastEl.textContent = msg;
  toastEl.className   = 'toast ' + type;
  requestAnimationFrame(() => toastEl.classList.add('show'));
  setTimeout(() => toastEl.classList.remove('show'), 3200);
}

function isEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

emailInput.addEventListener('input', () => fgEmail.classList.remove('has-error'));

resetForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const emailValue = emailInput.value.trim();

  if (!emailValue || !isEmail(emailValue)) {
    fgEmail.classList.add('has-error');
    errEmail.textContent = "Please enter a valid email address. Example: user@mail.com";
    return;
  }

  resetBtn.classList.add('loading');
  resetBtn.disabled = true;

  showToast('✓ Redirecting to TMDB recovery page...', 'success');

  setTimeout(() => {
    resetBtn.classList.remove('loading');
    resetBtn.disabled = false;

    window.location.href = "https://themoviedb.org";
  }, 1500);
});
