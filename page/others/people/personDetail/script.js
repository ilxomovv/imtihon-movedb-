let urlObj = new URL(window.location.href);
let id =
  urlObj.searchParams.get("id") ||
  window.location.href
    .slice(window.location.href.indexOf("=") + 1)
    .split("&")[0];
let type = "person";

const MEDIAL_LINK = "https://media.themoviedb.org/t/p/w200";
const HIGH_RES_LINK = "https://media.themoviedb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NzllMWNhOTFjMzQyMWJiZTY2MGNjYmQ5ODZiYTYxMCIsIm5iZiI6MTc3OTY0ODk3OS41MTQsInN1YiI6IjZhMTM0OWQzNjAzNzI5MDcyOWRiNWMyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tUFtBTtFOKeibppmy2k3CvYVpFTtsBGJ_AwZA9BCGqE",
  },
};

async function getPersonDetail() {
  try {
    let res = await fetch(
      `https://api.themoviedb.org/3/person/${id}?language=en-US`,
      options,
    );
    if (!res.ok) throw new Error("Error: " + res.status);
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getPersonMovies() {
  try {
    let res = await fetch(
      `https://api.themoviedb.org/3/person/${id}/movie_credits?language=en-US`,
      options,
    );
    if (!res.ok) throw new Error("Error: " + res.status);
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

(async function () {
  let result = document.getElementById("result");
  if (!result) return;

  result.innerHTML =
    '<div style="text-align:center; padding:100px 0; font-size:18px; color:#666;">Loading...</div>';

  const [info, moviesData] = await Promise.all([
    getPersonDetail(),
    getPersonMovies(),
  ]);

  if (!info) {
    result.innerHTML =
      "<h2 style='color:red; text-align:center; padding:50px;'>Ma'lumot topilmadi.</h2>";
    return;
  }

  let profilePath = info.profile_path
    ? HIGH_RES_LINK + info.profile_path
    : "https://via.placeholder.com/500x750?text=No+Image";

  let knownForHtml = "";
  let actingHtml = "";

  if (moviesData && moviesData.cast && moviesData.cast.length > 0) {
    let sortedForSlider = [...moviesData.cast].sort(
      (a, b) => (b.vote_count || 0) - (a.vote_count || 0),
    );

    sortedForSlider.slice(0, 15).forEach((movie) => {
      let posterPath = movie.poster_path
        ? MEDIAL_LINK + movie.poster_path
        : "https://via.placeholder.com/200x300?text=No+Poster";
      let movieTitle = movie.title || movie.name;
      knownForHtml += `
        <div class="movie-card" onclick="window.location.href='../../../movieDetail/index.html?id=${movie.id}&type=movie'">
          <img src="${posterPath}" alt="${movieTitle}">
          <div class="movie-title">${movieTitle}</div>
        </div>
      `;
    });

    let sortedByYear = [...moviesData.cast].sort((a, b) => {
      let dateA = a.release_date || "0000";
      let dateB = b.release_date || "0000";
      return dateB.localeCompare(dateA);
    });

    sortedByYear.forEach((movie) => {
      let year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
      let character = movie.character
        ? ` <span class="acting-role">as ${movie.character}</span>`
        : "";
      let movieTitle = movie.title || movie.name;

      actingHtml += `
        <div class="acting-row">
          <div class="acting-year">${year}</div>
          <div class="acting-circle"></div>
          <div class="acting-details">
            <span class="acting-movie-title" onclick="window.location.href='../../../movieDetail/index.html?id=${movie.id}&type=movie'">${movieTitle}</span>${character}
          </div>
        </div>
      `;
    });
  } else {
    knownForHtml = "<p style='color:#666;'>Ma'lumot yo'q.</p>";
    actingHtml = '<div class="acting-row">Kinolar ro\'yxati topilmadi.</div>';
  }

  result.innerHTML = `
    <div class="profile-container">
      <div class="profile-left">
        <img src="${profilePath}" alt="${info.name}">
      </div>
      <div class="profile-right">
        <h1>${info.name}</h1>
        
        <div class="section-title">Biography</div>
        <p class="biography-text">
          ${info.biography || "We don't have a biography for this person yet."}
        </p>
        
        <div class="section-title">Known For</div>
        <div class="movies-slider">
          ${knownForHtml}
        </div>

        <div class="section-title">Acting</div>
        <div class="acting-container">
          ${actingHtml}
        </div>
      </div>
    </div>
  `;
})();
