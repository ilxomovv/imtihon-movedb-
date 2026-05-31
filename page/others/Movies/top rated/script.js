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

  const sortSelect = document.getElementById("sort-by-select");
  if (sortSelect) {
    baseUrl += `&sort_by=${sortSelect.value}`;
  } else {
    baseUrl += `&sort_by=vote_average.desc`;
  }

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

  if (score) {
    baseUrl += `&vote_average.lte=${score.value}`;
  }

  if (votes) {
    baseUrl += `&vote_count.gte=${votes.value}`;
  } else {
    baseUrl += `&vote_count.gte=300`;
  }

  if (runtime) {
    baseUrl += `&with_runtime.lte=${runtime.value}`;
  }

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
            '<div class="loading-text">Hech narsa topilmadi</div>';
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
            <div class="card" style="background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); position: relative; display: flex; flex-direction: column; transition: transform 0.2s;">
              <div class="card-img-wrapper" style="position: relative; width: 100%; padding-top: 150%;">
                <img src="${poster}" alt="${movie.title}" loading="lazy" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                <button class="menu-btn" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); color: white; border: none; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">❤️</button>
              </div>
              <div class="card-content" style="padding: 14px; display: flex; flex-direction: column; gap: 6px;">
                <h3 class="card-title" title="${movie.title}" style="font-size: 15px; font-weight: 700; color: #000; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3;">${movie.title}</h3>
                <p class="card-date" style="font-size: 13px; color: #666; margin: 0;">${dateStr}</p>
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
        '<div class="loading-text" style="color:red;">Xatolik yuz berdi</div>';
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
  const sortSelect = document.getElementById("sort-by-select");
  if (sortSelect) {
    sortSelect.value = "vote_average.desc";
  }

  const votesSlider = document.getElementById("user-votes-slider");
  const votesVal = document.getElementById("user-votes-val");
  if (votesSlider && votesVal) {
    votesSlider.value = "300";
    votesVal.textContent = "300";
  }

  fetchMovies(currentPage, true);
});


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