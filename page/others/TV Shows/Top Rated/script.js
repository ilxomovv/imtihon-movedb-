const API_KEY_BEARER =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NzllMWNhOTFjMzQyMWJiZTY2MGNjYmQ5ODZiYTYxMCIsIm5iZiI6MTc3OTY0ODk3OS41MTQsInN1YiI6IjZhMTM0OWQzNjAzNzI5MDcyOWRiNWMyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tUFtBTtFOKeibppmy2k3CvYVpFTtsBGJ_AwZA9BCGqE";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

let currentPage = 1;
let allFetchedMovies = [];
let isSearching = false;

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("movies-container");
  const loadMoreBtn = document.getElementById("load-more-btn");

  const userScoreSlider = document.getElementById("user-score-slider");
  const userScoreVal = document.getElementById("user-score-val");
  const userVotesSlider = document.getElementById("user-votes-slider");
  const userVotesVal = document.getElementById("user-votes-val");
  const runtimeSlider = document.getElementById("runtime-slider");
  const runtimeVal = document.getElementById("runtime-val");
  const searchBtn = document.getElementById("search-submit-btn");
  const searchField = document.querySelector(".search-field");

  async function fetchMovies(page = 1, searchQuery = "") {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: API_KEY_BEARER,
      },
    };

    try {
      if (page === 1) {
        container.innerHTML = `<div class="loading-text">Loading movies...</div>`;
        allFetchedMovies = [];
      }

      let url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`;

      if (searchQuery !== "") {
        url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}&language=en-US&page=${page}`;
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        allFetchedMovies = [...allFetchedMovies, ...data.results];
        applyFilters();
      } else {
        if (page === 1) {
          container.innerHTML = `<div class="loading-text">No Movies found.</div>`;
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      container.innerHTML = `<div class="loading-text" style="color: red;">Failed to load data from TMDB.</div>`;
    }
  }

  function applyFilters() {
    let filteredResults = [...allFetchedMovies];

    const activeGenres = Array.from(
      document.querySelectorAll(".genre-tag.active"),
    ).map((t) => parseInt(t.dataset.id));
    if (activeGenres.length > 0) {
      filteredResults = filteredResults.filter(
        (movie) =>
          movie.genre_ids &&
          movie.genre_ids.some((genreId) => activeGenres.includes(genreId)),
      );
    }

    const minScore = parseFloat(userScoreSlider.value);
    filteredResults = filteredResults.filter(
      (movie) => (movie.vote_average || 0) <= minScore,
    );

    const minVotes = parseInt(userVotesSlider.value);
    if (minVotes > 0) {
      filteredResults = filteredResults.filter(
        (movie) => (movie.vote_count || 0) >= minVotes,
      );
    }

    const maxRuntime = parseInt(runtimeSlider.value);
    if (maxRuntime < 360) {
      filteredResults = filteredResults.filter((movie) => {
        if (!movie.runtime) return true;
        return movie.runtime <= maxRuntime;
      });
    }

    const selectedLang = document.getElementById("lang-select").value;
    if (selectedLang) {
      filteredResults = filteredResults.filter(
        (movie) => movie.original_language === selectedLang,
      );
    }

    const dateFrom = document.getElementById("date-from").value;
    const dateTo = document.getElementById("date-to").value;
    if (dateFrom) {
      filteredResults = filteredResults.filter(
        (movie) =>
          movie.release_date &&
          new Date(movie.release_date) >= new Date(dateFrom),
      );
    }
    if (dateTo) {
      filteredResults = filteredResults.filter(
        (movie) =>
          movie.release_date &&
          new Date(movie.release_date) <= new Date(dateTo),
      );
    }

    const sortBy = document.getElementById("sort-by-select").value;
    if (sortBy === "popularity.desc") {
      filteredResults.sort((a, b) => b.popularity - a.popularity);
    } else if (sortBy === "popularity.asc") {
      filteredResults.sort((a, b) => a.popularity - b.popularity);
    } else if (sortBy === "vote_average.desc") {
      filteredResults.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === "vote_average.asc") {
      filteredResults.sort((a, b) => a.vote_average - b.vote_average);
    } else if (
      sortBy === "release_date.desc" ||
      sortBy === "first_air_date.desc"
    ) {
      filteredResults.sort(
        (a, b) =>
          new Date(b.release_date || b.first_air_date) -
          new Date(a.release_date || a.first_air_date),
      );
    } else if (
      sortBy === "release_date.asc" ||
      sortBy === "first_air_date.asc"
    ) {
      filteredResults.sort(
        (a, b) =>
          new Date(a.release_date || a.first_air_date) -
          new Date(b.release_date || b.first_air_date),
      );
    }

    displayMovies(filteredResults);
  }

  function displayMovies(movies) {
    container.innerHTML = "";

    if (movies.length === 0) {
      container.innerHTML = `<div class="loading-text">No Movies match your filter criteria.</div>`;
      return;
    }

    let favorites = JSON.parse(localStorage.getItem("favorite_movies")) || [];

    movies.forEach((movie) => {
      const card = document.createElement("div");
      card.className = "card";

      let currentPath = window.location.pathname;
      let basePath = currentPath.substring(0, currentPath.lastIndexOf("/") + 1);
      const detailUrl = `${basePath}../../../movieDetail/index.html?id=${movie.id}&type=movie`;

      const posterUrl = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster";

      const movieTitle = movie.title || movie.name;
      const releaseDate =
        movie.release_date || movie.first_air_date
          ? new Date(
              movie.release_date || movie.first_air_date,
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Unknown Date";

      const isFavorite = favorites.includes(movie.id);
      const heartIconClass = isFavorite
        ? "fas fa-heart favorite-active"
        : "far fa-heart";

      card.innerHTML = `
                <div class="card-img-wrapper">
                    <a href="${detailUrl}" style="display:block; width:100%; height:100%;">
                        <img src="${posterUrl}" alt="${movieTitle}" loading="lazy">
                    </a>
                    
                </div>
                <div class="card-content">
                    <a href="${detailUrl}" style="text-decoration:none; color:inherit;">
                        <h3 class="card-title" title="${movieTitle}">${movieTitle}</h3>
                    </a>
                    <p class="card-date">${releaseDate}</p>
                </div>
            `;
      container.appendChild(card);
    });

    document.querySelectorAll(".heart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const movieId = parseInt(btn.dataset.id);
        let currentFavorites =
          JSON.parse(localStorage.getItem("favorite_movies")) || [];
        const icon = btn.querySelector("i");

        if (currentFavorites.includes(movieId)) {
          currentFavorites = currentFavorites.filter((id) => id !== movieId);
          icon.className = "far fa-heart";
          icon.classList.remove("favorite-active");
        } else {
          currentFavorites.push(movieId);
          icon.className = "fas fa-heart favorite-active";
        }

        localStorage.setItem(
          "favorite_movies",
          JSON.stringify(currentFavorites),
        );
      });
    });
  }

  userScoreSlider.addEventListener(
    "input",
    (e) => (userScoreVal.textContent = e.target.value),
  );
  userVotesSlider.addEventListener(
    "input",
    (e) => (userVotesVal.textContent = e.target.value),
  );
  runtimeSlider.addEventListener(
    "input",
    (e) => (runtimeVal.textContent = e.target.value),
  );

  const genreTags = document.querySelectorAll(".genre-tag");
  genreTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      tag.classList.toggle("active");
      applyFilters();
    });
  });

  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const parent = header.parentElement;
      const icon = header.querySelector("i");
      parent.classList.toggle("expanded");
      icon.className = parent.classList.contains("expanded")
        ? "fas fa-chevron-down"
        : "fas fa-chevron-right";
    });
  });

  searchBtn.addEventListener("click", () => {
    const searchInput = searchField.value.trim();
    currentPage = 1;

    if (searchInput !== "") {
      isSearching = true;
      fetchMovies(currentPage, searchInput);
    } else {
      isSearching = false;
      fetchMovies(currentPage);
    }
  });

  searchField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });

  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    const searchInput = searchField.value.trim();

    if (isSearching && searchInput !== "") {
      fetchMovies(currentPage, searchInput);
    } else {
      fetchMovies(currentPage);
    }
  });

  fetchMovies(1);
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