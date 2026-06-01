const forumLink = document.getElementById("forumLink");
const contactSalesBtn = document.getElementById("contactSalesBtn");
const gitContactBtn = document.getElementById("gitContactBtn");
const contactModal = document.getElementById("contactModal");
const closeModal = document.querySelector(".close-modal");

if (forumLink) {
  forumLink.addEventListener("click", () => {
    window.open("https://www.themoviedb.org/talk", "_blank");
  });
}

function openContactModal() {
  if (contactModal) {
    contactModal.style.display = "flex";
  }
}

contactSalesBtn?.addEventListener("click", openContactModal);
gitContactBtn?.addEventListener("click", openContactModal);

closeModal?.addEventListener("click", () => {
  contactModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === contactModal) {
    contactModal.style.display = "none";
  }
});
const sidebarMenu = document.getElementById("sidebarMenu");
if (sidebarMenu) {
  sidebarMenu.querySelectorAll("li[data-url]").forEach((li) => {
    li.addEventListener("click", () => {
      window.location.href = li.dataset.url;
    });
  });
}
contactSalesBtn?.addEventListener("click", () => {
  contactModal.style.display = "flex";
});

gitContactBtn?.addEventListener("click", () => {
  contactModal.style.display = "flex";
});

document.querySelector(".close-modal")?.addEventListener("click", () => {
  contactModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === contactModal) {
    contactModal.style.display = "none";
  }
});
const omdbLink = document.getElementById("omdbLink");
if (omdbLink) {
  omdbLink.addEventListener("click", () => {
    window.open("https://www.omdb.org/en/de", "_blank");
  });
}
const gravatarLink = document.getElementById("gravatarLink");
if (gravatarLink) {
  gravatarLink.addEventListener("click", () => {
    window.open("http://www.gravatar.com/", "_blank");
  });
}
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