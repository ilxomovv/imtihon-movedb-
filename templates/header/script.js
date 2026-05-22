async function kinoMalumot(kinoNomi) {
  const baseUrl = "https://omdbapi.com";
  const params = new URLSearchParams({
    apikey: "8c6ba54f",
    t: kinoNomi,
  });

  const natijaOynasi = document.getElementById("kinoNatija");

  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const data = await response.json();

    if (data.Response === "True") {
      console.log("✅ Ishladi!");
      natijaOynasi.innerHTML = `
        <h1>${data.Title} (${data.Year})</h1>
        <p><strong>Janr:</strong> ${data.Genre}</p>
        <p><strong>Reyting:</strong> ${data.imdbRating}</p>
        <img src="${data.Poster}" alt="${data.Title} posteri">
      `;
    } else {
      console.log("❌ API Xatosi:", data.Error);
      natijaOynasi.innerHTML = `<h1>Kino topilmadi!</h1>`;
    }
  } catch (error) {
    console.log("❌ Tarmoq xatosi:", error);
    natijaOynasi.innerHTML = `<h1>Tarmoqda xatolik yuz berdi!</h1>`;
  }
}

const qidirishTugmasi = document.getElementById("qidirishTugmasi");
const kinoInput = document.getElementById("kinoInput");

qidirishTugmasi.addEventListener("click", () => {
  const qidirilayotganKino = kinoInput.value.trim();

  if (qidirilayotganKino !== "") {
    kinoMalumot(qidirilayotganKino);
  } else {
    alert("Iltimos, kino nomini yozing!");
  }
});

kinoInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    qidirishTugmasi.click();
  }
});
