const API_KEY_BEARER =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NzllMWNhOTFjMzQyMWJiZTY2MGNjYmQ5ODZiYTYxMCIsIm5iZiI6MTc3OTY0ODk3OS41MTQsInN1YiI6IjZhMTM0OWQzNjAzNzI5MDcyOWRiNWMyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tUFtBTtFOKeibppmy2k3CvYVpFTtsBGJ_AwZA9BCGqE";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

let currentPage = 1;
let allFetchedShows = [];
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

  async function fetchTVShows(page = 1, searchQuery = "") {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: API_KEY_BEARER,
      },
    };

    try {
      if (page === 1) {
        container.innerHTML = `<div class="loading-text">Loading shows...</div>`;
        allFetchedShows = [];
      }

      let url = `https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=${page}`;

      if (searchQuery !== "") {
        url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(searchQuery)}&language=en-US&page=${page}`;
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        allFetchedShows = [...allFetchedShows, ...data.results];
        applyFilters();
      } else {
        if (page === 1) {
          container.innerHTML = `<div class="loading-text">No TV Shows found.</div>`;
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      container.innerHTML = `<div class="loading-text" style="color: red;">Failed to load data from TMDB.</div>`;
    }
  }

  function applyFilters() {
    let filteredResults = [...allFetchedShows];

    const activeGenres = Array.from(
      document.querySelectorAll(".genre-tag.active"),
    ).map((t) => parseInt(t.dataset.id));
    if (activeGenres.length > 0) {
      filteredResults = filteredResults.filter(
        (show) =>
          show.genre_ids &&
          show.genre_ids.some((genreId) => activeGenres.includes(genreId)),
      );
    }

    const minScore = parseFloat(userScoreSlider.value);
    filteredResults = filteredResults.filter(
      (show) => (show.vote_average || 0) <= minScore,
    );

    const minVotes = parseInt(userVotesSlider.value);
    if (minVotes > 0) {
      filteredResults = filteredResults.filter(
        (show) => (show.vote_count || 0) >= minVotes,
      );
    }

    const maxRuntime = parseInt(runtimeSlider.value);
    if (maxRuntime < 360) {
      filteredResults = filteredResults.filter((show) => {
        if (!show.episode_run_time || show.episode_run_time.length === 0)
          return true;
        return show.episode_run_time[0] <= maxRuntime;
      });
    }

    const selectedLang = document.getElementById("lang-select").value;
    if (selectedLang) {
      filteredResults = filteredResults.filter(
        (show) => show.original_language === selectedLang,
      );
    }

    const dateFrom = document.getElementById("date-from").value;
    const dateTo = document.getElementById("date-to").value;
    if (dateFrom) {
      filteredResults = filteredResults.filter(
        (show) =>
          show.first_air_date &&
          new Date(show.first_air_date) >= new Date(dateFrom),
      );
    }
    if (dateTo) {
      filteredResults = filteredResults.filter(
        (show) =>
          show.first_air_date &&
          new Date(show.first_air_date) <= new Date(dateTo),
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
    } else if (sortBy === "first_air_date.desc") {
      filteredResults.sort(
        (a, b) => new Date(b.first_air_date) - new Date(a.first_air_date),
      );
    } else if (sortBy === "first_air_date.asc") {
      filteredResults.sort(
        (a, b) => new Date(a.first_air_date) - new Date(b.first_air_date),
      );
    }

    displayShows(filteredResults);
  }

  function displayShows(shows) {
    container.innerHTML = "";

    if (shows.length === 0) {
      container.innerHTML = `<div class="loading-text">No TV Shows match your filter criteria.</div>`;
      return;
    }

    shows.forEach((show) => {
      const card = document.createElement("a");

      let currentPath = window.location.pathname;
      let basePath = currentPath.substring(0, currentPath.lastIndexOf("/") + 1);
      card.href = `${basePath}../../../movieDetail/index.html?id=${show.id}&type=tv`;

      card.className = "card";
      card.style.textDecoration = "none";

      const posterUrl = show.poster_path
        ? `${IMAGE_BASE_URL}${show.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster";

      const releaseDate = show.first_air_date
        ? new Date(show.first_air_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Unknown Date";

      card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${posterUrl}" alt="${show.name}" loading="lazy">
                </div>
                <div class="card-content">
                    <h3 class="card-title" title="${show.name}">${show.name}</h3>
                    <p class="card-date">${releaseDate}</p>
                </div>
            `;
      container.appendChild(card);
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
      fetchTVShows(currentPage, searchInput);
    } else {
      isSearching = false;
      fetchTVShows(currentPage);
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
      fetchTVShows(currentPage, searchInput);
    } else {
      fetchTVShows(currentPage);
    }
  });

  fetchTVShows(1);
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