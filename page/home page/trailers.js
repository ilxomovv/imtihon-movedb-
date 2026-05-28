const TRAILER_BG_URL =
  "https://media.themoviedb.org/t/p/w355_and_h200_multi_faces";
const trailerOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOTg4OGM2NThjYTVmOTRkZjdlODg0Y2Q3ODY4MTc2MiIsIm5iZiI6MTc3ODE1MzU0NC45NDgsInN1YiI6IjY5ZmM3ODQ4M2JlMWQzMzlmZGE2NDhiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L3gJtgI96y3tkN9a7PiKLesNb8Wl-XRDibPEAesn-N4",
  },
};

let currentTrailerTab = "popular";

function switchTrailerTab(tab) {
  currentTrailerTab = tab;
  const btnPop = document.getElementById("btnTrailerPop");
  const btnTheater = document.getElementById("btnTrailerTheater");

  if (!btnPop || !btnTheater) return;

  if (tab === "popular") {
    btnPop.style.background = "#21d4aa";
    btnPop.style.color = "#0d253f";
    btnTheater.style.background = "transparent";
    btnTheater.style.color = white;
    loadTrailers("movie/popular");
  } else {
    btnTheater.style.background = "#21d4aa";
    btnTheater.style.color = "#0d253f";
    btnPop.style.background = "transparent";
    btnPop.style.color = white;
    loadTrailers("movie/now_playing");
  }
}

async function loadTrailers(endpoint) {
  const container = document.getElementById("trailersContainer");
  if (!container) return;
  container.innerHTML = "<p style='color:white;'>Loading trailers...</p>";

  try {
    let res = await fetch(
      `https://api.themoviedb.org/3/${endpoint}?language=en-US&page=1`,
      trailerOptions,
    );
    let data = await res.json();
    let movies = data.results.slice(0, 8);

    let htmlContent = "";

    const videoPromises = movies.map((movie) =>
      fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
        trailerOptions,
      )
        .then((r) => r.json())
        .catch(() => ({ results: [] })),
    );

    const videosResults = await Promise.all(videoPromises);

    movies.forEach((movie, index) => {
      let videos = videosResults[index].results;
      // Rasmiy Treyler yoki Tizerni qidiramiz
      let officialVideo =
        videos.find((v) => v.type === "Trailer" || v.type === "Teaser") ||
        videos[0];

      if (officialVideo) {
        let videoUrl = `https://www.youtube.com/watch?v=${officialVideo.key}`;
        let bgImg = movie.backdrop_path
          ? TRAILER_BG_URL + movie.backdrop_path
          : "https://via.placeholder.com/355x200?text=No+Preview";

        htmlContent += `
          <div style="min-width: 300px; max-width: 300px; text-align: center; font-family: sans-serif;">
            <div style="position: relative; width: 100%; height: 170px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transition: transform 0.2s; cursor: pointer;" 
                 onmouseover="this.style.transform='scale(1.03)'" 
                 onmouseout="this.style.transform='scale(1)'"
                 onclick="window.open('${videoUrl}', '_blank')">
              
              <img src="${bgImg}" alt="${movie.title}" style="width: 100%; height: 100%; object-fit: cover;">
              
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2);">
                <div style="width: 50px; height: 50px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0d253f; font-size: 20px; padding-left: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.5);">▶</div>
              </div>
              
              <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px;">❤️</div>
            </div>
            
            <h4 style="margin: 10px 0 3px 0; font-size: 16px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: white;">${movie.title}</h4>
            <p style="margin: 0; font-size: 13px; color: #b3c4d7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${officialVideo.name}</p>
          </div>
        `;
      }
    });

    container.innerHTML =
      htmlContent || "<p style='color:white;'>No trailers found.</p>";
  } catch (error) {
    console.error("Trailers yuklashda xato:", error);
    container.innerHTML = "<p style='color:red;'>Failed to load trailers.</p>";
  }
}

loadTrailers("movie/popular");
