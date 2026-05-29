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
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NzllMWNhOTFjMzQyMWJiZTY2MGNjYmQ5ODZiYTYxMCIsIm5iZiI6MTc3OTY0ODk3OS41MTQsInN1YiI6IjZhMTM0OWQzNjAzNzI5MDcyOWRiNWMyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tUFtBTtFOKeibppmy2k3CvYVpFTtsBGJ_AwZA9BCGqE",
  },
};

function buildFilterURL(page) {
  let baseUrl = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}`;

  const dateFromInput = document.getElementById("date-from");
  const dateToInput = document.getElementById("date-to");

  if (dateFromInput && dateFromInput.value) {
    baseUrl += `&primary_release_date.gte=${dateFromInput.value}`;
  } else {
    const defaultFrom = new Date(Date.now() - 42 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    baseUrl += `&primary_release_date.gte=${defaultFrom}`;
  }

  if (dateToInput && dateToInput.value) {
    baseUrl += `&primary_release_date.lte=${dateToInput.value}`;
  } else {
    const defaultTo = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    baseUrl += `&primary_release_date.lte=${defaultTo}`;
  }

  baseUrl += `&with_release_type=2|3`;

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
  } else if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = "Yuklanmoqda...";
  }

  fetch(buildFilterURL(page), options)
    .then((res) => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    })
    .then((data) => {
      if (isNewSearch) container.innerHTML = "";
      if (loadMoreBtn) {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = "Load More";
      }

      if (!data.results || data.results.length === 0) {
        if (page === 1) {
          container.innerHTML =
            '<div class="loading-text" style="color:black;">No items were found that match your query.</div>';
        }
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
        return;
      }

      let moviesHtml = "";
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

        moviesHtml += `
          <a href="../../../movieDetail/index.html?id=${movie.id}" style="text-decoration: none; color: inherit;">
            <div class="card">
              <div class="card-img-wrapper"><img src="${poster}" alt="${movie.title}" loading="lazy"></div>
              <div class="card-content">
                <h3 class="card-title" title="${movie.title}">${movie.title}</h3>
                <p class="card-date">${dateStr}</p>
              </div>
            </div>
          </a>`;
      });

      container.insertAdjacentHTML("beforeend", moviesHtml);
      if (loadMoreBtn) {
        loadMoreBtn.style.display = data.results.length < 20 ? "none" : "block";
      }
    })
    .catch((err) => {
      console.error(err);
      container.innerHTML =
        '<div class="loading-text" style="color:black;">No items were found that match your query.</div>';
      if (loadMoreBtn) loadMoreBtn.style.display = "none";
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
  container.innerHTML =
    '<div class="loading-text" style="color:black;">No items were found that match your query.</div>';
  if (loadMoreBtn) loadMoreBtn.style.display = "none";
});
