const contactBtn = document.getElementById('contactBtn');
const contactModal = document.getElementById('contactModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const contactForm = document.getElementById('contactForm');

if (contactBtn && contactModal) {
  contactBtn.addEventListener('click', () => {
    contactModal.style.display = 'flex';
  });
}

if (closeModalBtn && contactModal) {
  closeModalBtn.addEventListener('click', () => {
    contactModal.style.display = 'none';
  });
}

window.addEventListener('click', (e) => {
  if (e.target === contactModal) {
    contactModal.style.display = 'none';
  }
});

if (contactForm && contactModal) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you! Your message has been sent successfully.');
    contactForm.reset();
    contactModal.style.display = 'none';
  });
}

const openModal = document.getElementById("openModal");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");

if (openModal && modal) {
  openModal.addEventListener("click", () => {
    modal.style.display = "flex";
  });
}
if (closeBtn && modal) {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}
window.addEventListener("click", (e) => {
  if (modal && e.target === modal) {
    modal.style.display = "none";
  }
});

const slides = [
  {
    image: "./../../../Assets/img/png/arrow-left.png",
    text: "The TMDB product, service, attitude and support are truly top notch.",
    author: "Scott Olechowski, Chief Product Officer & Co-founder of Plex, Inc."
  },
  {
    image: "./../../../Assets/img/png/logo.png", 
    text: "TMDB has one of the best communities on the internet today.",
    author: "John Carter, Lead Developer"
  },
  {
    image: "./../../../Assets/img/png/logo2.png", 
    text: "Their API and design system are incredibly powerful.",
    author: "Emily Watson, Product Designer"
  },
  {
    image: "./../../../Assets/img/png/logo3.png",
    text: "We enjoy building projects using TMDB every day.",
    author: "Michael Brown, Full Stack Engineer"
  }
];

const logo = document.getElementById("logo");
const desc = document.getElementById("desc");
const author = document.getElementById("author");
const next = document.getElementById("next");
const prev = document.getElementById("prev");
const dots = document.querySelectorAll(".dot");

let current = 0;

function showSlide(index) {
  if (!logo || !desc || !author || slides.length === 0) return;

  logo.src = slides[index].image;
  desc.textContent = slides[index].text;
  author.textContent = slides[index].author;

  dots.forEach(dot => {
    dot.classList.remove("active");
  });

  if (dots[index]) {
    dots[index].classList.add("active");
  }
}

if (next) {
  next.addEventListener("click", () => {
    current++;
    if (current >= slides.length) {
      current = 0;
    }
    showSlide(current);
  });
}

if (prev) {
  prev.addEventListener("click", () => {
    current--;
    if (current < 0) {
      current = slides.length - 1;
    }
    showSlide(current);
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    current = index;
    showSlide(current);
  });
});


const loginForm  = document.getElementById('loginForm');
const userInput  = document.getElementById('username');
const pwInput    = document.getElementById('password');
const fgUser     = document.getElementById('fg-username');
const fgPass     = document.getElementById('fg-password');
const togglePw   = document.getElementById('togglePw');
const eyeIcon    = document.getElementById('eyeIcon');

if (togglePw && pwInput && eyeIcon) {
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
}

if (userInput && fgUser) userInput.addEventListener('input', () => fgUser.classList.remove('has-error'));
if (pwInput && fgPass) pwInput.addEventListener('input', () => fgPass.classList.remove('has-error'));

const loginNavBtn = document.querySelector('button.login');
const joinNavBtn  = document.querySelector('button.join');
 
if (loginNavBtn) {
  loginNavBtn.addEventListener('click', () => {
    // others/ ICHIDAN login_page ga o'tish — bitta ../
    window.location.href = '../login_page/index.html';
  });
}
 
if (joinNavBtn) {
  joinNavBtn.addEventListener('click', () => {
    window.location.href = '../login_page/index.html';
  });
}