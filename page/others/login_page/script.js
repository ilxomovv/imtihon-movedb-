const BEARER  = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NzllMWNhOTFjMzQyMWJiZTY2MGNjYmQ5ODZiYTYxMCIsIm5iZiI6MTc3OTY0ODk3OS41MTQsInN1YiI6IjZhMTM0OWQzNjAzNzI5MDcyOWRiNWMyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tUFtBTtFOKeibppmy2k3CvYVpFTtsBGJ_AwZA9BCGqE';
const BASE    = 'https://api.themoviedb.org/3';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + BEARER
};

const loginForm  = document.getElementById('loginForm'); 
const userInput  = document.getElementById('username');
const pwInput    = document.getElementById('password');
const fgUser     = document.getElementById('fg-username');
const fgPass     = document.getElementById('fg-password');
const errUser    = document.getElementById('err-username');
const errPass    = document.getElementById('err-password');
const loginBtn   = document.getElementById('loginBtn');
const logoutBtn  = document.getElementById('logoutBtn');
const togglePw   = document.getElementById('togglePw');
const eyeIcon    = document.getElementById('eyeIcon');
const guestPanel = document.getElementById('guestPanel');
const userPanel  = document.getElementById('userPanel');
const toastEl    = document.getElementById('toast');

function showToast(msg, type = 'success') {
  toastEl.textContent = msg;
  toastEl.className   = 'toast ' + type;
  requestAnimationFrame(() => toastEl.classList.add('show'));
  setTimeout(() => toastEl.classList.remove('show'), 3200);
}

const eyeOpen = `
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>
`;
const eyeOff = `
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
  <line x1="1" y1="1" x2="23" y2="23"/>
`;

togglePw.addEventListener('click', () => {
  const hidden = pwInput.type === 'password';
  pwInput.type      = hidden ? 'text' : 'password';
  eyeIcon.innerHTML = hidden ? eyeOff : eyeOpen;
});

function isEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function validate() {
  let ok = true;
  const uv = userInput.value.trim();
  const pv = pwInput.value;

  if (!uv) {
    fgUser.classList.add('has-error');
    errUser.textContent = 'Please enter your username.';
    ok = false;
  } else if (uv.includes('@') && !isEmail(uv)) {
    fgUser.classList.add('has-error');
    errUser.textContent = "Invalid email format. Example: user@mail.com";
    ok = false;
  } else {
    fgUser.classList.remove('has-error');
  }

  if (!pv) {
    fgPass.classList.add('has-error');
    errPass.textContent = 'Please enter your password.';
    ok = false;
  } else if (pv.length < 4) {
    fgPass.classList.add('has-error');
    errPass.textContent = "Password must be at least 4 characters long.";
    ok = false;
  } else {
    fgPass.classList.remove('has-error');
  }

  return ok;
}

userInput.addEventListener('input', () => fgUser.classList.remove('has-error'));
pwInput.addEventListener('input',   () => fgPass.classList.remove('has-error'));

function showUserPanel(user) {
  document.querySelector('.login-left').style.opacity  = '0.4';
  document.querySelector('.login-left').style.pointerEvents = 'none';

  guestPanel.style.display = 'none';
  userPanel.style.display  = 'block';

  const initials = (user.name || user.username || '?').charAt(0).toUpperCase();
  document.getElementById('userAvatarPlaceholder').textContent = initials;
  document.getElementById('userName').textContent     = user.name     || '—';
  document.getElementById('userUsername').textContent = '@' + (user.username || '—');
  document.getElementById('userId').textContent       = 'ID: ' + user.id;

  if (user.avatar && user.avatar.tmdb && user.avatar.tmdb.avatar_path) {
    const img = document.getElementById('userAvatarImg');
    img.src                  = 'https://image.tmdb.org/t/p/w185' + user.avatar.tmdb.avatar_path;
    img.style.display        = 'block';
    document.getElementById('userAvatarPlaceholder').style.display = 'none'; 
  }
}

logoutBtn.addEventListener('click', async () => {
  logoutBtn.disabled    = true;
  logoutBtn.textContent = 'Logging out...';

  const sid = sessionStorage.getItem('tmdb_session');
  if (sid) {
    try {
      await fetch(BASE + '/authentication/session', {
        method:  'DELETE',
        headers: HEADERS,
        body:    JSON.stringify({ session_id: sid })
      });
    } catch (e) {
      console.warn('Error deleting session:', e);
    }
    sessionStorage.removeItem('tmdb_session');
  }

  userPanel.style.display  = 'none';
  guestPanel.style.display = 'block';

  const left = document.querySelector('.login-left');
  left.style.opacity       = '1';
  left.style.pointerEvents = 'auto';

  userInput.value = '';
  pwInput.value   = '';

  logoutBtn.disabled  = false;
  logoutBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
         viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
    Log Out
  `;

  showToast('Logged out successfully', 'success');
});


loginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); 
  if (!validate()) return;

  loginBtn.classList.add('loading');
  loginBtn.disabled = true;

  try {
    const r1 = await fetch(BASE + '/authentication/token/new', { headers: HEADERS });
    const d1 = await r1.json();
    if (!d1.success) throw new Error('Failed to get token');
    const reqToken = d1.request_token;

    const r2 = await fetch(BASE + '/authentication/token/validate_with_login', {
      method:  'POST',
      headers: HEADERS,
      body:    JSON.stringify({
        username:      userInput.value.trim(),
        password:      pwInput.value,
        request_token: reqToken
      })
    });
    const d2 = await r2.json();
    if (!d2.success) {
      throw new Error(d2.status_message || 'Invalid username or password');
    }

    const r3 = await fetch(BASE + '/authentication/session/new', {
      method:  'POST',
      headers: HEADERS,
      body:    JSON.stringify({ request_token: d2.request_token })
    });
    const d3 = await r3.json();
    if (!d3.success) throw new Error('Failed to create session');

    sessionStorage.setItem('tmdb_session', d3.session_id);

    const r4   = await fetch(BASE + '/account?session_id=' + d3.session_id, { headers: HEADERS });
    const user = await r4.json();
    
    showToast('✓ Logged in successfully!', 'success');
    showUserPanel(user);

    setTimeout(() => {
        window.location.href = "page/home page"; 
    }, 1500);

  } catch (err) {
    showToast('❌ ' + err.message, 'error');
    fgPass.classList.add('has-error');
    errPass.textContent = err.message || "Invalid username or password.";
  } finally {
    loginBtn.classList.remove('loading');
    loginBtn.disabled = false;
  }
});
