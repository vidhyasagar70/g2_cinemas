import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, Clock, Globe, Ticket, Filter } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const MoviesPage = () => {
  const navigate = useNavigate();
  const { movies } = useApp();
  const { selectMovie } = useBooking();
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, NOW_SHOWING, COMING_SOON
  const [selectedLanguage, setSelectedLanguage] = useState("ALL");
  const [selectedGenre, setSelectedGenre] = useState("ALL");

  // Extract unique languages and genres
  const allLanguages = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => m.languages?.forEach((l) => set.add(l)));
    return ["ALL", ...Array.from(set)];
  }, [movies]);

  const allGenres = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => m.genre?.forEach((g) => set.add(g)));
    return ["ALL", ...Array.from(set)];
  }, [movies]);

  // Filtered movies
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.cast?.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" ? true : movie.status === statusFilter;

      const matchesLanguage =
        selectedLanguage === "ALL" ? true : movie.languages?.includes(selectedLanguage);

      const matchesGenre =
        selectedGenre === "ALL" ? true : movie.genre?.includes(selectedGenre);

      return matchesSearch && matchesStatus && matchesLanguage && matchesGenre;
    });
  }, [movies, searchQuery, statusFilter, selectedLanguage, selectedGenre]);

  const handleBookMovie = (movie) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to book movie tickets.");
      navigate("/login", { state: { from: `/movie/${movie.id}` } });
      return;
    }
    selectMovie(movie);
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#292929] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Movies at <span className="text-[#FFC914]">G2 Cinemas</span>
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Experience the greatest blockbusters in Dolby Atmos, 4K Laser, and 3D.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#888] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, cast, director..."
            className="w-full bg-[#141414] border border-[#292929] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#FFC914] transition"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-[#111111] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#292929]">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-[#A1A1AA]">
          <Filter className="w-3.5 h-3.5 text-[#FFC914]" />
          <span>Filters:</span>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-[#333] overflow-x-auto">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === "ALL" ? "bg-[#FFC914] text-black" : "text-[#888] hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("NOW_SHOWING")}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === "NOW_SHOWING" ? "bg-[#FFC914] text-black" : "text-[#888] hover:text-white"
            }`}
          >
            Now Showing
          </button>
          <button
            onClick={() => setStatusFilter("COMING_SOON")}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === "COMING_SOON" ? "bg-[#FFC914] text-black" : "text-[#888] hover:text-white"
            }`}
          >
            Coming Soon
          </button>
        </div>

        {/* Language Select */}
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="bg-[#1a1a1a] border border-[#333] text-white text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl focus:border-[#FFC914] focus:outline-none cursor-pointer"
        >
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang === "ALL" ? "All Languages" : lang}
            </option>
          ))}
        </select>

        {/* Genre Select */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-[#1a1a1a] border border-[#333] text-white text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl focus:border-[#FFC914] focus:outline-none cursor-pointer"
        >
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre === "ALL" ? "All Genres" : genre}
            </option>
          ))}
        </select>

        {/* Active Results count */}
        <div className="ml-auto text-[11px] sm:text-xs text-[#777]">
          Showing <span className="font-bold text-white">{filteredMovies.length}</span> movies
        </div>
      </div>

      {/* Movies Grid - 2 Movies Per Row on Mobile */}
      {filteredMovies.length === 0 ? (
        <div className="text-center py-20 bg-[#111111] rounded-2xl border border-[#292929] p-8">
          <p className="text-sm font-semibold text-[#888]">
            No movies match your selected criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
              setSelectedLanguage("ALL");
              setSelectedGenre("ALL");
            }}
            className="mt-4 text-xs font-bold text-[#FFC914] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="group bg-[#171717] rounded-xl sm:rounded-2xl border border-[#292929] overflow-hidden hover:border-[#FFC914]/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#FFC914]/10 cursor-pointer"
              onClick={() => handleBookMovie(movie)}
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] overflow-hidden bg-[#111]">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent opacity-80" />

                <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 bg-[#080808]/85 backdrop-blur-md border border-[#333] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg flex items-center gap-1 text-[10px] sm:text-xs font-bold text-white">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#FFC914] text-[#FFC914]" />
                  <span>{movie.rating}</span>
                </div>

                <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 bg-[#080808]/85 backdrop-blur-md border border-[#333] px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-bold text-[#FFC914]">
                  {movie.ageRating}
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-3 flex-1 flex flex-col justify-between overflow-hidden">
                <div>
                  <h3 className="font-bold text-xs sm:text-base text-white group-hover:text-[#FFC914] transition-colors truncate">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#888] truncate mt-0.5">
                    {movie.genre?.join(" • ")}
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#A1A1AA]">
                    <span className="flex items-center gap-1 truncate">
                      <Clock className="w-3 h-3 text-[#FFC914] shrink-0" />
                      <span className="truncate">{movie.duration}</span>
                    </span>
                    <span className="bg-[#202020] px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded text-[9px] sm:text-[10px] text-[#ddd] shrink-0">
                      {movie.languages?.[0]}
                    </span>
                  </div>

                  {movie.status === "NOW_SHOWING" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookMovie(movie);
                      }}
                      className="w-full py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-[11px] sm:text-xs transition shadow-md shadow-[#FFC914]/20 flex items-center justify-center gap-1 cursor-pointer mt-1"
                    >
                      <Ticket className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black" />
                      <span>Book Now</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#222] text-[#666] font-bold text-[11px] sm:text-xs cursor-not-allowed mt-1"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

