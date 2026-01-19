// TMDB - Search/Movie
export const fetchMovieByTitle = async (movieTitle) => {
  const url = `https://api.themoviedb.org/3/search/movie?query=${movieTitle}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzRlOTVlMjE3ZDZiZjdiYjdkYTcwYjM3ZmYyZjU2MyIsIm5iZiI6MTc2MTU4NjIzMC43NDcsInN1YiI6IjY4ZmZhYzM2OThhOTZjZTI3ZWE2MzU1OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rcdAIWlU82_3U82eAdpS23j2Hz8IpLIuhmspx6TDZPw",
    },
  };
  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};

// TMDM - Movies/Details
export const fetchMovieByTMDBId = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzRlOTVlMjE3ZDZiZjdiYjdkYTcwYjM3ZmYyZjU2MyIsIm5iZiI6MTc2MTU4NjIzMC43NDcsInN1YiI6IjY4ZmZhYzM2OThhOTZjZTI3ZWE2MzU1OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rcdAIWlU82_3U82eAdpS23j2Hz8IpLIuhmspx6TDZPw",
    },
  };

  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};

// TMDB - Movies/Credits
export const getMovieCreditsByTMDBId = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzRlOTVlMjE3ZDZiZjdiYjdkYTcwYjM3ZmYyZjU2MyIsIm5iZiI6MTc2MTU4NjIzMC43NDcsInN1YiI6IjY4ZmZhYzM2OThhOTZjZTI3ZWE2MzU1OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rcdAIWlU82_3U82eAdpS23j2Hz8IpLIuhmspx6TDZPw",
    },
  };

  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};

// TMDB - Genres/Movie List
export const getAllGenres = async () => {
  const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzRlOTVlMjE3ZDZiZjdiYjdkYTcwYjM3ZmYyZjU2MyIsIm5iZiI6MTc2MTU4NjIzMC43NDcsInN1YiI6IjY4ZmZhYzM2OThhOTZjZTI3ZWE2MzU1OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rcdAIWlU82_3U82eAdpS23j2Hz8IpLIuhmspx6TDZPw",
    },
  };

  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};

// People/Movie Credits - get movies for an actor
