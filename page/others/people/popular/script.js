let currentPage = 1;

const IMG = "https://media.themoviedb.org/t/p/w300";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NzllMWNhOTFjMzQyMWJiZTY2MGNjYmQ5ODZiYTYxMCIsIm5iZiI6MTc3OTY0ODk3OS41MTQsInN1YiI6IjZhMTM0OWQzNjAzNzI5MDcyOWRiNWMyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tUFtBTtFOKeibppmy2k3CvYVpFTtsBGJ_AwZA9BCGqE",
  },
};

async function getPeople(page) {
  let res = await fetch(
    `https://api.themoviedb.org/3/person/popular?page=${page}`,
    options,
  );
  return await res.json();
}

function renderPagination(totalPages) {
  let container = document.getElementById("pagination-container");

  let html = "";

  html += `<button data-page="${currentPage - 1}">←</button>`;

  for (let i = 1; i <= 5; i++) {
    html += `<button data-page="${i}" class="${
      i === currentPage ? "active" : ""
    }">${i}</button>`;
  }

  html += `<button data-page="${currentPage + 1}">→</button>`;

  container.innerHTML = html;
}

async function loadPeople() {
  let container = document.getElementById("people-container");

  let data = await getPeople(currentPage);

  let html = "";

  data.results.forEach((person) => {
    let img = person.profile_path
      ? IMG + person.profile_path
      : "https://via.placeholder.com/300x450";

    let known = person.known_for
      .map((m) => m.title || m.name)
      .slice(0, 3)
      .join(", ");

    html += `
      <div class="person-card" onclick="window.location.href='../personDetail/index.html?id=${person.id}'">
        <img src="${img}">
        <div class="person-info">
          <div class="person-name">${person.name}</div>
          <div class="person-known">${known}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  renderPagination(data.total_pages);
}

document.getElementById("pagination-container").onclick = function (e) {
  if (e.target.tagName === "BUTTON") {
    let page = Number(e.target.getAttribute("data-page"));

    if (!page || page < 1) return;

    currentPage = page;
    loadPeople();
  }
};

loadPeople();

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