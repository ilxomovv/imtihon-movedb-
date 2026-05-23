// const options = {
//   method: "GET",
//   headers: {
//     accept: "application/json",
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYjE2ZmQzMDIyOTk4ZWYwZjdhN2MwN2RkOWRjNGQwNiIsIm5iZiI6MTc3OTQ1MDEwMy4wNzEsInN1YiI6IjZhMTA0MGY3Y2I2YTkzN2IwYWRlMjQ0NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fNdffNCETgTbZ6Zcqjz0KTQb-ZAzVWL7qjen7Owu7Ow",
//   },
// };
// let result = document.getElementById("bg");
// async function infoGet() {
//   try {
//     const res = await fetch(
//       "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
//       options,
//     );
//     return await res.json();
//   } catch (err) {
//     console.error(err);
//   }
// }

// async function main() {
//   let res = await infoGet();
//   console.log(res);

//   const backdropPath = res.results[0].backdrop_path;
//   const urlImg = `https://media.themoviedb.org/t/p/w500${backdropPath}`;
//   console.log(urlImg);

//   result.innerHTML = `<img src="${urlImg}" alt="dsa">`;
// }

// main();
