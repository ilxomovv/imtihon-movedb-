let id = window.location.href.slice(window.location.href.indexOf("=") + 1);
const MEDIAL_LINK = "https://media.themoviedb.org/t/p/w200";
const MEDIAL_BG = "https://media.themoviedb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NzllMWNhOTFjMzQyMWJiZTY2MGNjYmQ5ODZiYTYxMCIsIm5iZiI6MTc3OTY0ODk3OS41MTQsInN1YiI6IjZhMTM0OWQzNjAzNzI5MDcyOWRiNWMyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tUFtBTtFOKeibppmy2k3CvYVpFTtsBGJ_AwZA9BCGqE",
  },
};

async function getInfoDetailScreen() {
  try {
    let res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
      options,
    );
    if (!res.ok) throw new Error("Film yuklashda xato: " + res.status);
    return await res.json();
  } catch (error) {
    console.error("Film ma'lumotlarini olishda xato:", error);
    return null;
  }
}

async function getCredits(movieId) {
  try {
    let res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
      options,
    );
    if (!res.ok) throw new Error("Aktyorlarni yuklashda xato: " + res.status);
    return await res.json();
  } catch (error) {
    console.error("Aktyorlar ma'lumotlarini olishda xato:", error);
    return null;
  }
}

(async function () {
  let result = document.getElementById("result");

  if (!result) {
    console.error("HTML ichida 'result' ID li element topilmadi!");
    return;
  }

  const [info, credits] = await Promise.all([
    getInfoDetailScreen(),
    getCredits(id),
  ]);

  if (!info) {
    result.innerHTML =
      "<h2 style='color:red; text-align:center;'>Kino ma'lumotlarini yuklashda xatolik yuz berdi. Token yoki ID ni tekshiring!</h2>";
    return;
  }

  let percent = Math.round((info.vote_average || 0) * 10);
  let releaseYear = info.release_date ? info.release_date.slice(0, 4) : "N/A";

  let castHtml = "";
  if (credits && credits.cast && credits.cast.length > 0) {
    credits.cast.slice(0, 15).forEach((actor) => {
      let profilePath = actor.profile_path
        ? MEDIAL_LINK + actor.profile_path
        : "https://via.placeholder.com/150x225?text=No+Image";

      castHtml += `
        <div class="castCard">
          <img src="${profilePath}" alt="${actor.name}">
          <div class="castInfo">
            <h4>${actor.name}</h4>
            <p>${actor.character}</p>
          </div>
        </div>
      `;
    });
  } else {
    castHtml = "<p>Aktyorlar haqida ma'lumot topilmadi yoki yuklanmadi.</p>";
  }

  result.innerHTML = `
    <div class="movieDetail">
      <img class="movieBg" src="${MEDIAL_BG + (info.backdrop_path || "")}" alt="">
      <div class="overlay">
        <div class="poster">
          <img src="${MEDIAL_LINK + (info.poster_path || "")}" alt="">
        </div>
        <div class="movieInfo">
          <div class="aaa">
            <a href="/page/movieDetail/index.html?id=${id}" class="hovera"><h1>${info.title || info.original_title}</h1></a>
            <h1>(${releaseYear})</h1>
          </div>
          <div class="titleBottom">
            ${info.release_date || ""} (${info.origin_country ? info.origin_country[0] : ""}) • 
            ${info.genres ? info.genres.map((g) => g.name).join(", ") : ""} • 
            ${info.runtime ? info.runtime + "m" : ""}
          </div>

          <div class="topActions">
            <div class="scoreBox">
              <div class="scoreCircle">
                <span>${percent}%</span>
              </div>
              <div class="scoreText">
                <p>User</p>
                <p>Score</p>
              </div>
            </div>
            <div class="emojiRow">
              <span>😍</span>
              <span>😄</span>
              <span>😮</span>
            </div>
            <div class="vibeBtn">What's your <span>Vibe</span> ℹ️</div>
          </div>

          <div class="actionRow">
            <div class="circleBtn">≡</div>
            <div class="circleBtn">❤</div>
            <div class="circleBtn">🔖</div>
            <div class="playBtn">▶ Play Trailer</div>
          </div>
          <p class="tagline">${info.tagline || ""}</p>
          <div class="malumotcha"><h3 class="over">Overview</h3> ${info.overview || "Ma'lumot mavjud emas."}</div>
        </div>
      </div>
    </div>

    <div class="castSection">
      <h2>Top Billed Cast</h2>
      <div class="castSlider">
        ${castHtml}
      </div>
      
<a href="/page/movieDetail/cast.html?id=${id}" class="fullCastBtn">Full Cast & Crew</a>
    </div>
  `;
})();
