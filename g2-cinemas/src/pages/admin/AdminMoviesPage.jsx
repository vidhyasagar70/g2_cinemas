import React, { useState, useMemo } from "react";
import {
  Film,
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Search,
  Star,
  Globe,
  X,
  CheckCircle2,
  Sliders,
  ChevronDown
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import toast from "react-hot-toast";

export const AdminMoviesPage = () => {
  const {
    movies,
    shows,
    screens,
    addMovie,
    updateMovie,
    deleteMovie,
    addShow,
    deleteShow
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("MOVIES"); // MOVIES, SHOWS
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showShowModal, setShowShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // Movie Form State
  const [movieForm, setMovieForm] = useState({
    title: "",
    tagline: "",
    description: "",
    poster: "/images/movies/mookuthi-amman-2-poster.jpg",
    banner: "/images/movies/mookuthi-amman-2-banner.jpg",
    genre: "Action, Thriller",
    duration: "145 minutes",
    languages: "Tamil",
    releaseYear: 2026,
    director: "Sundar C",
    cast: "Leading Stars",
    ageRating: "UA 16+",
    rating: "8.8",
    status: "NOW_SHOWING"
  });

  // Show Form State
  const [showForm, setShowForm] = useState({
    movieId: movies[0]?.id || "",
    screenId: screens[0]?.id || "screen-1",
    date: new Date().toISOString().split("T")[0],
    time: "07:00 PM",
    format: "Dolby Atmos 2D - Tamil",
    status: "Available"
  });

  const filteredMovies = useMemo(() => {
    return movies.filter((m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [movies, searchQuery]);

  const handleOpenAddMovie = () => {
    setEditingMovie(null);
    setMovieForm({
      title: "",
      tagline: "",
      description: "",
      poster: "/images/movies/mookuthi-amman-2-poster.jpg",
      banner: "/images/movies/mookuthi-amman-2-banner.jpg",
      genre: "Action, Thriller",
      duration: "145 minutes",
      languages: "Tamil",
      releaseYear: 2026,
      director: "Sundar C",
      cast: "Leading Stars",
      ageRating: "UA 16+",
      rating: "8.8",
      status: "NOW_SHOWING"
    });
    setShowMovieModal(true);
  };

  const handleOpenEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      tagline: movie.tagline || "",
      description: movie.description,
      poster: movie.poster,
      banner: movie.banner || movie.poster,
      genre: movie.genre?.join(", ") || "",
      duration: movie.duration,
      languages: movie.languages?.join(", ") || "",
      releaseYear: movie.releaseYear,
      director: movie.director,
      cast: movie.cast?.join(", ") || "",
      ageRating: movie.ageRating,
      rating: movie.rating,
      status: movie.status
    });
    setShowMovieModal(true);
  };

  const handleSaveMovie = (e) => {
    e.preventDefault();
    if (!movieForm.title) {
      toast.error("Movie title is required.");
      return;
    }

    const payload = {
      ...movieForm,
      genre: movieForm.genre.split(",").map((s) => s.trim()),
      languages: movieForm.languages.split(",").map((s) => s.trim()),
      cast: movieForm.cast.split(",").map((s) => s.trim())
    };

    if (editingMovie) {
      updateMovie(editingMovie.id, payload);
    } else {
      addMovie(payload);
    }

    setShowMovieModal(false);
  };

  const handleAddShowSubmit = (e) => {
    e.preventDefault();
    const targetScreen = screens.find((s) => s.id === showForm.screenId) || screens[0];

    addShow({
      movieId: showForm.movieId,
      screenId: showForm.screenId,
      screenName: targetScreen.name,
      date: showForm.date,
      time: showForm.time,
      format: showForm.format,
      status: showForm.status,
      pricing: { Standard: 190, Premium: 290, Recliner: 420 },
      bookedSeats: [],
      blockedSeats: []
    });

    setShowShowModal(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292929] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Movies & Showtime Administration
          </h1>
          <p className="text-xs text-[#888]">
            Add or edit cinema titles, assign auditoriums, and schedule shows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddMovie}
            className="flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black px-4 py-2.5 rounded-xl text-xs font-black transition shadow-lg shadow-[#FFC914]/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 fill-black" />
            <span>Add New Movie</span>
          </button>

          <button
            onClick={() => setShowShowModal(true)}
            className="flex items-center gap-2 bg-[#171717] hover:bg-[#252525] text-white border border-[#2e2e2e] px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#FFC914]" />
            <span>Schedule Show</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#222] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("MOVIES")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "MOVIES"
                ? "bg-[#FFC914] text-black"
                : "text-[#888] hover:text-white"
            }`}
          >
            Movies Catalog ({movies.length})
          </button>
          <button
            onClick={() => setActiveTab("SHOWS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "SHOWS"
                ? "bg-[#FFC914] text-black"
                : "text-[#888] hover:text-white"
            }`}
          >
            Scheduled Shows ({shows.length})
          </button>
        </div>

        {activeTab === "MOVIES" && (
          <div className="relative w-64 hidden sm:block">
            <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-[#141414] border border-[#292929] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#666] focus:border-[#FFC914]"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Movies Catalog */}
      {activeTab === "MOVIES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#141414] rounded-3xl border border-[#292929] overflow-hidden flex flex-col justify-between hover:border-[#444] transition"
            >
              <div className="p-5 flex gap-4">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded-2xl border border-[#333] shrink-0"
                />
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        movie.status === "NOW_SHOWING"
                          ? "bg-[#22C55E]/15 text-[#22C55E]"
                          : "bg-[#FFC914]/15 text-[#FFC914]"
                      }`}
                    >
                      {movie.status === "NOW_SHOWING" ? "Now Showing" : "Coming Soon"}
                    </span>
                    <span className="text-[10px] text-[#777] font-bold">
                      {movie.ageRating}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-white truncate">
                    {movie.title}
                  </h3>
                  <p className="text-[11px] text-[#888] line-clamp-1">{movie.genre?.join(", ")}</p>
                  <p className="text-[11px] text-[#777]">{movie.duration} • {movie.languages?.join(", ")}</p>
                  <p className="text-[10px] text-[#FFC914]">Dir: {movie.director}</p>
                </div>
              </div>

              <div className="bg-[#191919] px-5 py-3 border-t border-[#242424] flex items-center justify-between text-xs">
                <span className="text-[#888]">Rating: ★ {movie.rating}/10</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditMovie(movie)}
                    className="p-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-white transition cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#FFC914]" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${movie.title}?`)) {
                        deleteMovie(movie.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-[#222] hover:bg-red-950/40 text-[#888] hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Shows Schedule Management */}
      {activeTab === "SHOWS" && (
        <div className="bg-[#141414] rounded-3xl border border-[#292929] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#292929] bg-[#101010] text-[#777] uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Movie</th>
                  <th className="py-3 px-4">Auditorium Screen</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Occupancy</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {shows.map((show) => {
                  const movie = movies.find((m) => m.id === show.movieId) || {};
                  return (
                    <tr key={show.id} className="hover:bg-[#1a1a1a] transition">
                      <td className="py-3 px-4 font-bold text-white">{movie.title || "Movie"}</td>
                      <td className="py-3 px-4 text-[#ddd]">{show.screenName}</td>
                      <td className="py-3 px-4 text-[#888]">{show.date}</td>
                      <td className="py-3 px-4 font-bold text-[#FFC914]">{show.time}</td>
                      <td className="py-3 px-4 text-[#aaa]">{show.format}</td>
                      <td className="py-3 px-4 text-[#888]">
                        {show.bookedSeats?.length || 0} Booked
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#202020] text-[#FFC914]">
                          {show.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm("Remove this showtime from schedule?")) {
                              deleteShow(show.id);
                            }
                          }}
                          className="p-1 rounded-lg text-[#888] hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Movie Modal */}
      {showMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-[#141414] border border-[#292929] rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#292929] pb-3">
              <h3 className="font-extrabold text-base text-white">
                {editingMovie ? "Edit Movie Details" : "Add New Cinema Title"}
              </h3>
              <button
                onClick={() => setShowMovieModal(false)}
                className="text-[#888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4 text-xs">
              <div>
                <label className="text-[#888] block mb-1">Movie Title *</label>
                <input
                  type="text"
                  required
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-[#888] block mb-1">Tagline</label>
                <input
                  type="text"
                  value={movieForm.tagline}
                  onChange={(e) => setMovieForm({ ...movieForm, tagline: e.target.value })}
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-[#888] block mb-1">Synopsis / Description</label>
                <textarea
                  rows={2}
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888] block mb-1">Poster Image URL</label>
                  <input
                    type="url"
                    value={movieForm.poster}
                    onChange={(e) => setMovieForm({ ...movieForm, poster: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#888] block mb-1">Banner Backdrop URL</label>
                  <input
                    type="url"
                    value={movieForm.banner}
                    onChange={(e) => setMovieForm({ ...movieForm, banner: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#888] block mb-1">Duration</label>
                  <input
                    type="text"
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#888] block mb-1">Rating (e.g. 8.8)</label>
                  <input
                    type="text"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#888] block mb-1">Age Rating</label>
                  <input
                    type="text"
                    value={movieForm.ageRating}
                    onChange={(e) => setMovieForm({ ...movieForm, ageRating: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888] block mb-1">Genre (comma-separated)</label>
                  <input
                    type="text"
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#888] block mb-1">Languages (comma-separated)</label>
                  <input
                    type="text"
                    value={movieForm.languages}
                    onChange={(e) => setMovieForm({ ...movieForm, languages: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888] block mb-1">Director</label>
                  <input
                    type="text"
                    value={movieForm.director}
                    onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#888] block mb-1">Status</label>
                  <select
                    value={movieForm.status}
                    onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="NOW_SHOWING">Now Showing</option>
                    <option value="COMING_SOON">Coming Soon</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#292929]">
                <button
                  type="button"
                  onClick={() => setShowMovieModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#888] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FFC914] text-black font-extrabold text-xs hover:bg-[#EAB308]"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Show Modal */}
      {showShowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#141414] border border-[#292929] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#292929] pb-3">
              <h3 className="font-extrabold text-base text-white">Schedule New Showtime</h3>
              <button
                onClick={() => setShowShowModal(false)}
                className="text-[#888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddShowSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#888] block mb-1">Select Movie</label>
                <select
                  value={showForm.movieId}
                  onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#888] block mb-1">Select Auditorium Screen</label>
                <select
                  value={showForm.screenId}
                  onChange={(e) => setShowForm({ ...showForm, screenId: e.target.value })}
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                >
                  {screens.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name} ({sc.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888] block mb-1">Date</label>
                  <input
                    type="date"
                    value={showForm.date}
                    onChange={(e) => setShowForm({ ...showForm, date: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#888] block mb-1">Time (e.g. 06:30 PM)</label>
                  <input
                    type="text"
                    value={showForm.time}
                    onChange={(e) => setShowForm({ ...showForm, time: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#888] block mb-1">Audio / Visual Format</label>
                <input
                  type="text"
                  value={showForm.format}
                  onChange={(e) => setShowForm({ ...showForm, format: e.target.value })}
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#292929]">
                <button
                  type="button"
                  onClick={() => setShowShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#888] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FFC914] text-black font-extrabold text-xs hover:bg-[#EAB308]"
                >
                  Schedule Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

