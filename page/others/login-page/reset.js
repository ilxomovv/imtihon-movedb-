// =====================
// ELEMENT REFERENCES
// =====================
const resetForm = document.getElementById('resetForm');
const emailInput = document.getElementById('resetEmail');
const fgEmail    = document.getElementById('fg-email');
const errEmail   = document.getElementById('err-email');
const resetBtn   = document.getElementById('resetBtn');
const toastEl    = document.getElementById('toast');

// =====================
// TOAST
// =====================
function showToast(msg, type = 'success') {
  toastEl.textContent = msg;
  toastEl.className   = 'toast ' + type;
  requestAnimationFrame(() => toastEl.classList.add('show'));
  setTimeout(() => toastEl.classList.remove('show'), 3200);
}

// Email formatini tekshirish
function isEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

// Input yozilganda xatolikni o'chirish
emailInput.addEventListener('input', () => fgEmail.classList.remove('has-error'));

// =====================
// FORM SUBMIT
// =====================
resetForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const emailValue = emailInput.value.trim();

  // Validatsiya
  if (!emailValue || !isEmail(emailValue)) {
    fgEmail.classList.add('has-error');
    errEmail.textContent = "Please enter a valid email address. Example: user@mail.com";
    return;
  }

  // Yuklanish holati (Loading)
  resetBtn.classList.add('loading');
  resetBtn.disabled = true;

  // TMDB parolni tiklashni tashqi havola orqali boshqargani uchun yo'naltiramiz
  showToast('✓ Redirecting to TMDB recovery page...', 'success');

  setTimeout(() => {
    resetBtn.classList.remove('loading');
    resetBtn.disabled = false;
    
    // TMDB rasmiy parolni tiklash sahifasiga o'tkazish
    window.location.href = "https://themoviedb.org";
  }, 1500);
});
