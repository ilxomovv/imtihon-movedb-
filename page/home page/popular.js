const POPULAR_MEDIA_URL = "https://media.themoviedb.org/t/p/w200";
const popularOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOTg4OGM2NThjYTVmOTRkZjdlODg0Y2Q3ODY4MTc2MiIsIm5iZiI6MTc3ODE1MzU0NC45NDgsInN1YiI6IjY5ZmM3ODQ4M2JlMWQzMzlmZGE2NDhiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L3gJtgI96y3tkN9a7PiKLesNb8Wl-XRDibPEAesn-N4",
  },
};

function setTvId(id) {
  window.location.href = `../movieDetail/index.html?id=${id}&type=tv`;
}

async function getPopularTV() {
  try {
    let res = await fetch(
      "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1",
      popularOptions,
    );
    if (!res.ok) throw new Error("Xato: " + res.status);
    let data = await res.json();
    renderPopularTV(data.results);
  } catch (error) {
    console.error(error);
  }
}

function renderPopularTV(shows) {
  const container = document.getElementById("popularContainer");
  if (!container) return;
  container.innerHTML = "";

  shows.forEach((show) => {
    let posterPath = show.poster_path
      ? POPULAR_MEDIA_URL + show.poster_path
      : "https://via.placeholder.com/200x300?text=No+Poster";
    let percent = Math.round((show.vote_average || 0) * 10);
    let airDate = show.first_air_date || "No date";

    // script.js ichidagi xotira funksiyasidan tekshiradi
    let isFav =
      typeof isFavorite === "function" ? isFavorite(show.id, "tv") : false;

    // optionsBtn ichidagi uch nuqta butunlay o'chirilib, ishlaydigan yurakchaga almashtirildi
    container.innerHTML += `
      <div onclick="setTvId(${show.id})" class="movieCard" style="cursor: pointer;">
        <div class="imageContainer" style="position: relative;">
          <img src="${posterPath}" alt="${show.name}">
          <div class="optionsBtn" onclick="toggleFavorite(event, ${show.id}, 'tv', '${show.name.replace(/'/g, "\\'")}', '${posterPath}')" 
               style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.8); border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; font-size: 16px; filter: ${isFav ? "none" : "grayscale(100%)"};">
            ❤️
          </div>
        </div>
        <div class="movieMeta">
          <h4 class="movieTitle" style="margin: 5px 0; font-size: 15px;">${show.name}</h4>
          <p class="movieDate" style="margin: 0; color: grey; font-size: 13px;">${airDate} • Score: ${percent}%</p>
        </div>
      </div>
    `;
  });
}

getPopularTV();
