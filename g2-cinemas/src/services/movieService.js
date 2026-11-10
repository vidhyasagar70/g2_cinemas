import { INITIAL_MOVIES } from "../data/movies";
import { INITIAL_SHOWS } from "../data/shows";

const MOVIES_KEY = "g2_cinemas_movies";
const SHOWS_KEY = "g2_cinemas_shows";
const CATALOG_VERSION_KEY = "g2_cinemas_catalogue_version";
const CURRENT_CATALOG_VERSION = "v7_two_dolby_atmos_screens";

// Check and perform seed migration if old version exists
const checkCatalogueVersion = () => {
  try {
    const version = localStorage.getItem(CATALOG_VERSION_KEY);
    if (version !== CURRENT_CATALOG_VERSION) {
      // Overwrite active movie catalogue and show schedules with new releases
      localStorage.setItem(MOVIES_KEY, JSON.stringify(INITIAL_MOVIES));
      localStorage.setItem(SHOWS_KEY, JSON.stringify(INITIAL_SHOWS));
      localStorage.removeItem("g2_cinemas_bookings");
      localStorage.removeItem("g2_cinemas_orders");
      localStorage.setItem(CATALOG_VERSION_KEY, CURRENT_CATALOG_VERSION);
    }
  } catch (e) {
    console.error("Error checking catalog version", e);
  }
};

checkCatalogueVersion();

export const movieService = {
  getMovies: () => {
    try {
      checkCatalogueVersion();
      const data = localStorage.getItem(MOVIES_KEY);
      if (!data) return INITIAL_MOVIES;
      const parsed = JSON.parse(data);
      // Extra safety check: if stored movies contain obsolete titles (e.g. Dune), replace with INITIAL_MOVIES
      const hasObsolete = parsed.some((m) =>
        ["Dune", "Oppenheimer", "Interstellar", "Gladiator", "Avatar", "Batman"].some((old) =>
          m.title?.toLowerCase().includes(old.toLowerCase())
        )
      );
      if (hasObsolete) {
        localStorage.setItem(MOVIES_KEY, JSON.stringify(INITIAL_MOVIES));
        return INITIAL_MOVIES;
      }
      return parsed;
    } catch {
      return INITIAL_MOVIES;
    }
  },

  saveMovies: (movies) => {
    try {
      localStorage.setItem(MOVIES_KEY, JSON.stringify(movies));
    } catch (e) {
      console.error("Error saving movies to localStorage", e);
    }
  },

  getMovieById: (id) => {
    const movies = movieService.getMovies();
    return movies.find((m) => m.id === id);
  },

  addMovie: (movieData) => {
    const movies = movieService.getMovies();
    const newMovie = {
      ...movieData,
      id: `mov-${Date.now()}`
    };
    const updated = [newMovie, ...movies];
    movieService.saveMovies(updated);
    return newMovie;
  },

  updateMovie: (id, movieData) => {
    const movies = movieService.getMovies();
    const updated = movies.map((m) => (m.id === id ? { ...m, ...movieData } : m));
    movieService.saveMovies(updated);
    return updated.find((m) => m.id === id);
  },

  deleteMovie: (id) => {
    const movies = movieService.getMovies();
    const updated = movies.filter((m) => m.id !== id);
    movieService.saveMovies(updated);
    return updated;
  },

  // Shows
  getShows: () => {
    try {
      checkCatalogueVersion();
      const data = localStorage.getItem(SHOWS_KEY);
      if (!data) return INITIAL_SHOWS;
      const parsed = JSON.parse(data);
      // Safety check: if stored shows reference obsolete movie IDs (mov-1 from old dune seed), refresh
      const hasObsolete = parsed.some((s) =>
        s.movieId === "mov-1" || s.movieId === "mov-2" || s.movieId === "mov-3" || s.movieId === "mov-4" || s.movieId === "mov-5" || s.movieId === "mov-6"
      );
      if (hasObsolete) {
        localStorage.setItem(SHOWS_KEY, JSON.stringify(INITIAL_SHOWS));
        return INITIAL_SHOWS;
      }
      return parsed;
    } catch {
      return INITIAL_SHOWS;
    }
  },

  saveShows: (shows) => {
    try {
      localStorage.setItem(SHOWS_KEY, JSON.stringify(shows));
    } catch (e) {
      console.error("Error saving shows to localStorage", e);
    }
  },

  getShowsByMovieId: (movieId) => {
    const shows = movieService.getShows();
    return shows.filter((s) => s.movieId === movieId);
  },

  getShowById: (showId) => {
    const shows = movieService.getShows();
    return shows.find((s) => s.id === showId);
  },

  addShow: (showData) => {
    const shows = movieService.getShows();
    const newShow = {
      ...showData,
      id: `show-${Date.now()}`,
      bookedSeats: showData.bookedSeats || [],
      blockedSeats: showData.blockedSeats || []
    };
    const updated = [...shows, newShow];
    movieService.saveShows(updated);
    return newShow;
  },

  updateShow: (id, showData) => {
    const shows = movieService.getShows();
    const updated = shows.map((s) => (s.id === id ? { ...s, ...showData } : s));
    movieService.saveShows(updated);
    return updated.find((s) => s.id === id);
  },

  deleteShow: (id) => {
    const shows = movieService.getShows();
    const updated = shows.filter((s) => s.id !== id);
    movieService.saveShows(updated);
    return updated;
  }
};
