const MEDIAL_LINK = "https://media.themoviedb.org/t/p/w200";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOTg4OGM2NThjYTVmOTRkZjdlODg0Y2Q3ODY4MTc2MiIsIm5iZiI6MTc3ODE1MzU0NC45NDgsInN1YiI6IjY5ZmM3ODQ4M2JlMWQzMzlmZGE2NDhiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L3gJtgI96y3tkN9a7PiKLesNb8Wl-XRDibPEAesn-N4",
  },
};

function setId(id) {
  window.location.href = `/page/movieDetail/index.html?id=${id}&type=movie`;
}

// Sevimlilarga qo'shish funksiyasi (Ikkala fayl uchun ham bitta xotira)
function toggleFavorite(e, id, type, title, poster) {
  e.stopPropagation(); // Kartochka bosilib ketishini to'xtatadi
  let favorites = JSON.parse(localStorage.getItem("favMovies")) || [];
  let index = favorites.findIndex(
    (item) => item.id === id && item.type === type,
  );

  if (index > -1) {
    favorites.splice(index, 1); // Agar bor bo'lsa, o'chiradi
    e.target.style.filter = "grayscale(100%)";
  } else {
    favorites.push({ id, type, title, poster }); // Yo'q bo'lsa, qo'shadi
    e.target.style.filter = "none";
  }
  localStorage.setItem("favMovies", JSON.stringify(favorites));
}

function isFavorite(id, type) {
  let favorites = JSON.parse(localStorage.getItem("favMovies")) || [];
  return favorites.some((item) => item.id === id && item.type === type);
}

const bannerInput = document.querySelector(".banner input");
const navInput = document.querySelector(".search-field");
const trendingTitle = document.querySelector(".trending h2");
const trendingContainer = document.getElementById("trendingMovies");

function getInfo() {
  try {
    return fetch(
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
      options,
    )
      .then((res) => res.json())
      .then((res) => res);
  } catch (error) {
    console.error(error);
  }
}

(async function () {
  if (!trendingContainer) return;
  let data = await getInfo();
  if (!data || !data["results"]) return;
  let movies = data["results"];

  trendingContainer.innerHTML = "";
  movies.forEach((item) => {
    let poster = item["poster_path"]
      ? MEDIAL_LINK + item["poster_path"]
      : "https://via.placeholder.com/200x300?text=No+Poster";
    let isFav = isFavorite(item.id, "movie");

    // Burchakka mutlaq joylashgan chiroyli yurakcha tugmasi
    trendingContainer.innerHTML += `
      <div onclick="setId(${item["id"]})" class='movilCart' style="cursor: pointer; position: relative;">
        <div onclick="toggleFavorite(event, ${item.id}, 'movie', '${item.original_title.replace(/'/g, "\\'")}', '${poster}')" 
             style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.8); border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; z-index: 10; font-size: 16px; transition: 0.2s; filter: ${isFav ? "none" : "grayscale(100%)"};">
          ❤️
        </div>
        <img src="${poster}" alt=""> 
        <h1>${item["original_title"]}</h1> 
        <p>${item["release_date"]}</p>
      </div>`;
  });
})();

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
  if (!trendingContainer) return;
  trendingContainer.innerHTML = "";
  if (trendingTitle) trendingTitle.innerText = `Search Results: "${query}"`;

  movies.forEach((item) => {
    let poster = item.poster_path
      ? MEDIAL_LINK + item.poster_path
      : "https://via.placeholder.com/200x300?text=No+Poster";
    let isFav = isFavorite(item.id, "movie");

    trendingContainer.innerHTML += `
      <div onclick="setId(${item.id})" class='movilCart' style="cursor: pointer; position: relative;">
        <div onclick="toggleFavorite(event, ${item.id}, 'movie', '${item.title.replace(/'/g, "\\'")}', '${poster}')" 
             style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.8); border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; z-index: 10; font-size: 16px; filter: ${isFav ? "none" : "grayscale(100%)"};">
          ❤️
        </div>
        <img src="${poster}" alt="">
        <h1>${item.title}</h1>
        <p>${item.release_date || "No date"}</p>
      </div>`;
  });
}

async function handleSearch(value) {
  let query = value.trim();
  if (!query) return;
  let movies = await searchMovies(query);
  renderSearchResults(movies, query);
}

if (bannerInput) {
  bannerInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch(bannerInput.value);
  });
}
if (navInput) {
  navInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch(navInput.value);
  });
}
