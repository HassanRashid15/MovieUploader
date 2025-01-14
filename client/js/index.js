const apiKey = "bb918be7e7d654714715a5272ba7e821"; // Your TMDb API key
const carouselInner = document.getElementById("carousel-inner");
const movieListElement = document.getElementById("movie-list");
const searchInput = document.getElementById("searchInput");

// Fetch popular movies (default)
async function fetchFeaturedMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
  const response = await fetch(url);
  const data = await response.json();
  const movies = data.results;

  // Show featured movies in carousel
  showFeaturedMovies(movies);
  // Show popular movies in grid
  showPopularMovies(movies);
}

// Fetch movies based on search query
async function fetchSearchResults(query) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
    query
  )}&language=en-US&page=1`;
  const response = await fetch(url);
  const data = await response.json();
  const movies = data.results;

  // Show searched movies in grid
  showPopularMovies(movies);
  // Optionally, you can also show these movies in the carousel
  showFeaturedMovies(movies);
}

// Display featured movies in carousel
function showFeaturedMovies(movies) {
  carouselInner.innerHTML = ""; // Clear previous carousel items
  movies.slice(0, 5).forEach((movie, index) => {
    const isActive = index === 0 ? "active" : "inactive";

    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item", isActive);

    const imagePath = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
      : "default-image.jpg";

    carouselItem.innerHTML = `
      <img src="${imagePath}" class="d-block w-100" alt="${movie.title}">
      <div class="carousel-caption d-none d-md-block">
        <h5>${movie.title}</h5>
        <p>${movie.overview.substring(0, 150)}...</p>
      </div>
    `;
    carouselInner.appendChild(carouselItem);
  });
}

// Display popular or searched movies in grid
function showPopularMovies(movies) {
  movieListElement.innerHTML = "";
  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("col-md-3");
    movieElement.innerHTML = `
      <div class="movie-card" data-bs-toggle="modal" data-bs-target="#movieModal" onclick="showMovieDetails(${movie.id})">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
        </div>
      </div>
    `;
    movieListElement.appendChild(movieElement);
  });
}

// Show movie details in modal
async function showMovieDetails(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
  const response = await fetch(url);
  const movie = await response.json();

  // Set the modal content
  document.getElementById("movieModalLabel").textContent = movie.title;
  document.getElementById("movieOverview").textContent = movie.overview;
  document.getElementById("movieReleaseDate").textContent = movie.release_date;

  const moviePosterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "default-poster.jpg";
  document.getElementById("moviePoster").src = moviePosterUrl;

  // Check for a full movie link (here we are using 'homepage' as an example)
  const fullMovieLink = movie.homepage || ""; // You can change this logic to suit your needs

  // Check if the movie has a full movie link available
  if (fullMovieLink) {
    // If full movie is available, update the button to watch the full movie
    document.getElementById("playButton").textContent = "Watch Full Movie";
    document.getElementById("playButton").onclick = function () {
      window.open(fullMovieLink, "_blank");
    };
    document.getElementById("movieDetailsMessage").textContent =
      "You can watch the full movie here!";
  } else {
    // If no full movie is available, show trailer link
    document.getElementById("playButton").textContent = "Watch Trailer";
    document.getElementById("playButton").onclick = function () {
      window.open(
        `https://www.youtube.com/results?search_query=${movie.title} trailer`,
        "_blank"
      );
    };
    document.getElementById("movieDetailsMessage").textContent =
      "Full movie is not available, only trailer.";
  }
}

// Listen for search input changes
searchInput.addEventListener("input", function () {
  const query = searchInput.value.trim();

  if (query === "") {
    // If the search field is empty, fetch the popular movies
    fetchFeaturedMovies();
  } else {
    // If there's a search query, fetch search results
    fetchSearchResults(query);
  }
});

// Initialize the app
fetchFeaturedMovies();
