let currentPage = 1;

const container = document.getElementById("movies-container");
const loadMoreBtn = document.getElementById("load-more-btn");
const searchSubmitBtn = document.getElementById("search-submit-btn");

document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.parentElement;
    item.classList.toggle("expanded");

    const icon = header.querySelector("i");
    if (icon) {
      icon.className = item.classList.contains("expanded")
        ? "fas fa-chevron-down"
        : "fas fa-chevron-right";
    }
  });
});

document.querySelectorAll(".genre-tag").forEach((tag) => {
  tag.addEventListener("click", () => tag.classList.toggle("active"));
});

const setupSlider = (sliderId, valId) => {
  const slider = document.getElementById(sliderId);
  const val = document.getElementById(valId);
  if (slider && val) {
    slider.addEventListener("input", (e) => {
      val.textContent = e.target.value;
    });
  }
};

setupSlider("user-score-slider", "user-score-val");
setupSlider("user-votes-slider", "user-votes-val");
setupSlider("runtime-slider", "runtime-val");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer YOUR_TOKEN",
  },
};

function buildFilterURL(page) {
  let baseUrl = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}`;

  const sortSelect = document.getElementById("sort-by-select");
  baseUrl += `&sort_by=${sortSelect ? sortSelect.value : "popularity.desc"}`;

  const countrySelect = document.getElementById("country-select");
  if (countrySelect && countrySelect.value) {
    baseUrl += `&watch_region=${countrySelect.value}`;
  }

  const activeGenres = [];
  document.querySelectorAll(".genre-tag.active").forEach((tag) => {
    activeGenres.push(tag.getAttribute("data-id"));
  });

  if (activeGenres.length > 0) {
    baseUrl += `&with_genres=${activeGenres.join(",")}`;
  }

  const score = document.getElementById("user-score-slider");
  const votes = document.getElementById("user-votes-slider");
  const runtime = document.getElementById("runtime-slider");

  if (score) baseUrl += `&vote_average.lte=${score.value}`;
  if (votes) baseUrl += `&vote_count.gte=${votes.value}`;
  if (runtime) baseUrl += `&with_runtime.lte=${runtime.value}`;

  const langSelect = document.getElementById("lang-select");
  if (langSelect && langSelect.value) {
    baseUrl += `&with_original_language=${langSelect.value}`;
  }

  return baseUrl;
}

function fetchMovies(page, isNewSearch = false) {
  if (isNewSearch) {
    container.innerHTML =
      '<div class="loading-text"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
  }

  const apiUrl = buildFilterURL(page);

  fetch(apiUrl, options)
    .then((res) => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    })
    .then((data) => {
      if (isNewSearch) container.innerHTML = "";

      if (!data.results || data.results.length === 0) {
        if (page === 1) {
          container.innerHTML =
            '<div class="loading-text">Hech narsa topilmadi</div>';
        }
        return;
      }

      data.results.forEach((movie) => {
        const poster = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://via.placeholder.com/500x750?text=No+Poster";

        const dateStr = movie.release_date
          ? new Date(movie.release_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A";

        container.innerHTML += `
          <div class="card">
            <div class="card-img-wrapper">
              <img src="${poster}" alt="${movie.title}">
            </div>
            <div class="card-content">
              <h3 class="card-title" title="${movie.title}">
                ${movie.title}
              </h3>
              <p class="card-date">${dateStr}</p>
            </div>
          </div>
        `;
      });
    })
    .catch((err) => {
      console.error(err);
      if (page === 1) {
        container.innerHTML =
          '<div class="loading-text" style="color:red;">Xatolik yuz berdi</div>';
      }
    });
}

if (searchSubmitBtn) {
  searchSubmitBtn.addEventListener("click", () => {
    currentPage = 1;
    fetchMovies(currentPage, true);
  });
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    fetchMovies(currentPage, false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchMovies(currentPage, true);
});
