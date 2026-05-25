const MEDIAL_LINK = "https://media.themoviedb.org/t/p/w200";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOTg4OGM2NThjYTVmOTRkZjdlODg0Y2Q3ODY4MTc2MiIsIm5iZiI6MTc3ODE1MzU0NC45NDgsInN1YiI6IjY5ZmM3ODQ4M2JlMWQzMzlmZGE2NDhiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L3gJtgI96y3tkN9a7PiKLesNb8Wl-XRDibPEAesn-N4",
  },
};

function getInfo(params) {
  try {
    return fetch(
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
      options,
    )
      .then((res) => res.json())
      .then((res) => res);
  } catch (error) {
    alert(error);
  }
}

(async function (params) {
  let resultMovies = document.getElementById("trendingMovies");
  let data = await getInfo();
  let movies = data["results"];
  console.log(movies);
  movies.map((item) => {
    resultMovies.innerHTML += `<div onclick="setId(${item["id"]})"  class='movilCart'><img src="${MEDIAL_LINK + item["poster_path"]}" alt=""> <h1>${item["original_title"]}</h1> <p>${item["release_date"]}</p></div>`;
  });
})();

function setId(id) {
  window.location.href = `/page/movieDetail/index.html?id=${id}`;
}
const bannerInput = document.querySelector(".banner input");
const navInput = document.querySelector(".search-field");

const trendingTitle = document.querySelector(".trending h2");
const resultMovies = document.getElementById("trendingMovies");
async function searchMovies(query) {
  try {
    let res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=1`,
      options,
    );
    let data = await res.json();
    return data.results;
  } catch (error) {
    console.log(error);
  }
}
function renderSearchResults(movies, query) {
  resultMovies.innerHTML = "";

  trendingTitle.innerText = `Search Results: "${query}"`;

  movies.forEach((item) => {
    resultMovies.innerHTML += `
      <div onclick="setId(${item.id})" class='movilCart'>
        <img src="${MEDIAL_LINK + item.poster_path}" alt="">
        <h1>${item.title}</h1>
        <p>${item.release_date || "No date"}</p>
      </div>
    `;
  });
}
async function handleSearch(value) {
  let query = value.trim();

  if (!query) return;

  let movies = await searchMovies(query);
  renderSearchResults(movies, query);
}
bannerInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch(bannerInput.value);
  }
});
navInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch(navInput.value);
  }
});
const popularOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NzllMWNhOTFjMzQyMWJiZTY2MGNjYmQ5ODZiYTYxMCIsIm5iZiI6MTc3OTY0ODk3OS41MTQsInN1YiI6IjZhMTM0OWQzNjAzNzI5MDcyOWRiNWMyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tUFtBTtFOKeibppmy2k3CvYVpFTtsBGJ_AwZA9BCGqE",
  },
};

async function loadPopularShows() {
  try {
    let res = await fetch(
      "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1",
      popularOptions,
    );
    let data = await res.json();

    let popularContainer = document.getElementById("popularContainer");

    if (!popularContainer) {
      console.error("Xato: HTML ichida 'popularContainer' topilmadi!");
      return;
    }

    let html = "";
    const IMAGE_BASE_URL = "https://media.themoviedb.org/t/p/w200";

    data.results.forEach((show) => {
      let posterPath = show.poster_path
        ? IMAGE_BASE_URL + show.poster_path
        : "https://via.placeholder.com/150x225?text=No+Poster";

      let rawDate = show.first_air_date;
      let formattedDate = "No date";

      if (rawDate) {
        let dateObj = new Date(rawDate);
        formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }

      html += `
        <div class="movieCard">
          <div class="imageContainer">
            <img src="${posterPath}" alt="${show.name}">
            <div class="optionsBtn">•••</div>
          </div>
          <div class="movieMeta">
            <a href="/page/movieDetail/index.html?id=${show.id}" class="movieTitle">${show.name}</a>
            <p class="movieDate">${formattedDate}</p>
          </div>
        </div>
      `;
    });

    popularContainer.innerHTML = html;
  } catch (error) {
    console.error("Ommabop ko'rsatuvlarni yuklashda xato:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPopularShows();
});
