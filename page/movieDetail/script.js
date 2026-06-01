let urlObj = new URL(window.location.href);
let id =
  urlObj.searchParams.get("id") ||
  window.location.href
    .slice(window.location.href.indexOf("=") + 1)
    .split("&")[0];
let type = urlObj.searchParams.get("type") || "movie";

const MEDIAL_LINK = "https://media.themoviedb.org/t/p/w200";
const MEDIAL_BG = "https://media.themoviedb.org/t/p/w500";
const VIDEO_BG_LINK = "https://media.themoviedb.org/t/p/w780";

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
      `https://api.themoviedb.org/3/${type}/${id}?language=en-US`,
      options,
    );
    if (!res.ok) throw new Error("Yuklashda xato: " + res.status);
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getCredits(mediaId) {
  try {
    let res = await fetch(
      `https://api.themoviedb.org/3/${type}/${mediaId}/credits?language=en-US`,
      options,
    );
    if (!res.ok) throw new Error("Yuklashda xato: " + res.status);
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

function inson(id) {
  window.location.href = `../others/people/personDetail/index.html?id=${id}&type=movie`;
}

async function getRecommendations(mediaId) {
  try {
    let res = await fetch(
      `https://api.themoviedb.org/3/${type}/${mediaId}/recommendations?language=en-US&page=1`,
      options,
    );
    if (!res.ok) throw new Error("Tavsiyalarni yuklashda xato: " + res.status);
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getVideos(mediaId) {
  try {
    let res = await fetch(
      `https://api.themoviedb.org/3/${type}/${mediaId}/videos?language=en-US`,
      options,
    );
    if (!res.ok) throw new Error("Videolarni yuklashda xato");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getImages(mediaId) {
  try {
    let res = await fetch(
      `https://api.themoviedb.org/3/${type}/${mediaId}/images`,
      options,
    );
    if (!res.ok) throw new Error("Rasmlarni yuklashda xato");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

(async function () {
  let result = document.getElementById("result");
  if (!result) return;

  const [info, credits, recommendations, videosData, imagesData] =
    await Promise.all([
      getInfoDetailScreen(),
      getCredits(id),
      getRecommendations(id),
      getVideos(id),
      getImages(id),
    ]);

  if (!info) {
    result.innerHTML =
      "<h2 style='color:red; text-align:center;'>Ma'lumotlarni yuklashda xatolik yuz berdi.</h2>";
    return;
  }

  let percent = Math.round((info.vote_average || 0) * 10);
  let releaseYear = info.release_date
    ? info.release_date.slice(0, 4)
    : info.first_air_date
      ? info.first_air_date.slice(0, 4)
      : "N/A";

  let castHtml = "";
  if (credits && credits.cast && credits.cast.length > 0) {
    credits.cast.slice(0, 15).forEach((actor) => {
      let profilePath = actor.profile_path
        ? MEDIAL_LINK + actor.profile_path
        : "https://via.placeholder.com/150x225?text=No+Image";

      castHtml += `
        <div class="castCard" onclick="inson(${actor.id})" style="cursor: pointer;">
          <img src="${profilePath}" alt="${actor.name}">
          <div class="castInfo">
            <h4>${actor.name}</h4>
            <p>${actor.character}</p>
          </div>
        </div>
      `;
    });
  } else {
    castHtml = "<p>Aktyorlar haqida ma'lumot topilmadi.</p>";
  }

  let videoCount = videosData?.results?.length || 0;
  let backdropCount = imagesData?.backdrops?.length || 0;
  let posterCount = imagesData?.posters?.length || 0;

  let mainVideo =
    videosData?.results?.find(
      (v) => v.type === "Trailer" || v.type === "Teaser",
    ) || videosData?.results?.[0];
  let videoUrl = mainVideo
    ? `https://www.youtube.com/watch?v=${mainVideo.key}`
    : "#";

  let mediaBackground = info.backdrop_path
    ? VIDEO_BG_LINK + info.backdrop_path
    : "https://via.placeholder.com/780x440?text=No+Media+Preview";

  let recHtml = "";
  if (
    recommendations &&
    recommendations.results &&
    recommendations.results.length > 0
  ) {
    recommendations.results.slice(0, 12).forEach((item) => {
      let imgPath = item.backdrop_path
        ? MEDIAL_BG + item.backdrop_path
        : item.poster_path
          ? MEDIAL_LINK + item.poster_path
          : "https://via.placeholder.com/300x169?text=No+Image";
      let title = item.title || item.name;
      let itemPercent = Math.round((item.vote_average || 0) * 10);
      recHtml += `
        <div class="castCard" onclick="window.location.href='../movieDetail/index.html?id=${item.id}&type=${type}'" style="cursor:pointer; min-width: 250px;">
          <img src="${imgPath}" alt="${title}" style="width:100%; height:140px; object-fit:cover; border-radius:8px;">
          <div class="castInfo" style="padding: 8px 5px; display: flex; justify-content: space-between; align-items: center;">
            <h4 style="margin:0; font-size:14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 75%;">${title}</h4>
            <span style="font-size:12px; color:#21d4aa; font-weight:bold;">${itemPercent}%</span>
          </div>
        </div>
      `;
    });
  } else {
    recHtml = "<p>O'xshash kontentlar topilmadi.</p>";
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
            <a href="/page/movieDetail/index.html?id=${id}&type=${type}" class="hovera"><h1>${info.title || info.name || info.original_title}</h1></a>
            <h1>(${releaseYear})</h1>
          </div>
          <div class="titleBottom">
            ${info.release_date || info.first_air_date || ""} (${info.origin_country ? info.origin_country[0] : ""}) • 
            ${info.genres ? info.genres.map((g) => g.name).join(", ") : ""} • 
            ${info.runtime ? info.runtime + "m" : info.episode_run_time ? info.episode_run_time[0] + "m" : ""}
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
            <a href="${videoUrl}" target="_blank" style="text-decoration:none;"><div class="playBtn">▶ Play Trailer</div></a>
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
      <a href="./cast.html?id=${id}&type=${type}" class="fullCastBtn">Full Cast & Crew</a>
    </div>

    <div class="castSection" style="margin-top: 30px; font-family: sans-serif;">
      <div style="display: flex; gap: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px; font-weight: bold; font-size: 16px;">
        <span style="cursor: pointer; border-bottom: 3px solid black; color: black; padding-bottom: 10px;">Media</span>
        <span style="color: gray; cursor: pointer;">Most Popular</span>
        <span style="color: gray; cursor: pointer;">Videos ${videoCount}</span>
        <span style="color: gray; cursor: pointer;">Backdrops ${backdropCount}</span>
        <span style="color: gray; cursor: pointer;">Posters ${posterCount}</span>
      </div>
      
      <div style="position: relative; width: 100%; max-width: 850px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
        <img src="${mediaBackground}" alt="Media Background" style="width: 100%; display: block; filter: brightness(0.85);">
        
        <a href="${videoUrl}" target="_blank" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-decoration: none;">
          ${
            mainVideo
              ? `
            <div style="width: 70px; height: 70px; background: rgba(0,0,0,0.7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; transition: 0.3s;">
              ▶
            </div>
          `
              : ""
          }
        </a>
        
        <div style="position: absolute; bottom: 15px; left: 20px; color: white; font-size: 22px; font-weight: bold; text-shadow: 1px 1px 5px rgba(0,0,0,0.8);">
          ${mainVideo ? mainVideo.type.toUpperCase() : "NO VIDEO AVAILABLE"}
        </div>
      </div>
    </div>

    <div class="castSection" style="margin-top: 40px;">
      <h2>If you liked <i>${info.title || info.name}</i>, you might also like...</h2>
      <div class="castSlider" style="display: flex; overflow-x: auto; gap: 15px; padding-bottom: 10px;">
        ${recHtml}
      </div>
    </div>
  `;
})();

const loginNavBtn = document.querySelector('button.login');
const joinNavBtn  = document.querySelector('button.join');
 
if (loginNavBtn) {
  loginNavBtn.addEventListener('click', () => {
    // home page/ dan others/login_page/ ga o'tish
    window.location.href = '../others/login_page/index.html';
  });
}
 
if (joinNavBtn) {
  joinNavBtn.addEventListener('click', () => {
    window.location.href = '../others/login_page/index.html';
  });
}