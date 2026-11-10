import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Play,
  Ticket,
  Star,
  Clock,
  Globe,
  Shield,
  Sparkles,
  Film,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const HomePage = () => {
  const navigate = useNavigate();
  const { movies, selectedLocation } = useApp();
  const { selectMovie } = useBooking();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("NOW_SHOWING");

  // All movies currently showing for the carousel
  const nowShowing = movies.filter((m) => m.status === "NOW_SHOWING");
  const comingSoon = movies.filter((m) => m.status === "COMING_SOON");
  const carouselMovies = nowShowing.length > 0 ? nowShowing : movies;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel every 6 seconds unless user pauses/hovers
  useEffect(() => {
    if (isPaused || carouselMovies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % carouselMovies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, carouselMovies.length]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + carouselMovies.length) % carouselMovies.length);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % carouselMovies.length);
  };

  const handleBookNow = (movie) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to book movie tickets.");
      navigate("/login", { state: { from: `/movie/${movie.id}` } });
      return;
    }
    selectMovie(movie);
    navigate(`/movie/${movie.id}`);
  };

  const activeMovie = carouselMovies[currentSlideIndex] || carouselMovies[0];

  return (
    <div className="space-y-16">
      {/* 5.1 Hero Section - Interactive Carousel of All Now Showing Movies */}
      {carouselMovies.length > 0 && activeMovie && (
        <>
          {/* ======================================================== */}
          {/* MOBILE HERO CAROUSEL (< md)                              */}
          {/* Dedicated 16:9 Banner Card with Zero Cutting & Clear Text*/}
          {/* ======================================================== */}
          <div
            className="md:hidden space-y-3 px-3 pt-3 select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* 16:9 Theatrical Banner Container - Uncropped & Crisp */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#111] border border-[#262626] shadow-2xl">
              {/* Ambient Glow */}
              <div
                key={`m-ambient-${activeMovie.id}`}
                className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-40 scale-110 pointer-events-none transition-all duration-700"
                style={{
                  backgroundImage: `url(${activeMovie.carousel || activeMovie.banner || activeMovie.poster})`
                }}
              />

              {/* 16:9 Banner Image - Full Widescreen with Zero Cutting */}
              <img
                key={`m-banner-${activeMovie.id}`}
                src={activeMovie.carousel || activeMovie.banner || activeMovie.poster}
                alt={activeMovie.title}
                className="relative z-10 w-full h-full object-cover object-center select-none animate-in fade-in duration-500"
              />

              {/* Subtle top & bottom edge gradients */}
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/70 to-transparent z-20 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-2 inset-x-2.5 z-30 flex items-center justify-between pointer-events-none">
                <div className="inline-flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-[#FFC914]/50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-[#FFC914] shadow-md">
                  <Sparkles className="w-3 h-3 text-[#FFC914]" />
                  <span>NOW SHOWING • VADIPATTI</span>
                </div>
                <span className="text-[10px] font-mono text-white bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                  {String(currentSlideIndex + 1).padStart(2, "0")} / {String(carouselMovies.length).padStart(2, "0")}
                </span>
              </div>

              {/* Prev / Next Slide Arrows on the Banner */}
              {carouselMovies.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="Previous Slide"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/75 hover:bg-[#FFC914] text-white hover:text-black border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-xl active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next Slide"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/75 hover:bg-[#FFC914] text-white hover:text-black border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-xl active:scale-95 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Slide Dots Inside Banner */}
              <div className="absolute bottom-2 inset-x-0 z-30 flex items-center justify-center gap-1.5 pointer-events-none">
                {carouselMovies.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlideIndex
                        ? "w-6 bg-[#FFC914] shadow-sm shadow-[#FFC914]"
                        : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Movie Information & Action Controls */}
            <div className="space-y-2 px-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {activeMovie.title.split(":")[0]}
                  {activeMovie.title.includes(":") && (
                    <span className="text-[#FFC914] block text-sm font-extrabold">
                      :{activeMovie.title.split(":")[1]}
                    </span>
                  )}
                </h2>
                <span className="bg-[#1a1a1a] border border-[#333] px-2 py-0.5 rounded text-[#FFC914] font-black text-[10px] shrink-0">
                  {activeMovie.ageRating}
                </span>
              </div>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#A1A1AA]">
                <span className="flex items-center gap-1 text-white bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#333] font-bold text-[10px]">
                  <Star className="w-3 h-3 fill-[#FFC914] text-[#FFC914]" />
                  <span>{activeMovie.rating}</span>
                  <span className="text-[#666]">/10</span>
                </span>
                <span className="flex items-center gap-1 text-[10px]">
                  <Clock className="w-3 h-3 text-[#FFC914]" />
                  <span>{activeMovie.duration}</span>
                </span>
                <span>•</span>
                <span className="text-white text-[10px] font-medium">{activeMovie.genre?.slice(0, 2).join(", ")}</span>
                <span>•</span>
                <span className="text-[10px] text-[#ccc]">{activeMovie.languages?.[0]}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  onClick={() => handleBookNow(activeMovie)}
                  className="flex-1 py-2 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-xs transition shadow-md shadow-[#FFC914]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5 fill-black" />
                  <span>Book Tickets</span>
                </button>

                <a
                  href={activeMovie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#171717] hover:bg-[#222] text-white border border-[#333] font-bold text-xs flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-white text-white" />
                  <span>Trailer</span>
                </a>

                <Link
                  to={`/movie/${activeMovie.id}`}
                  className="p-2 rounded-xl bg-[#171717] hover:bg-[#222] text-[#888] hover:text-[#FFC914] border border-[#333] flex items-center justify-center"
                  title="View Details"
                >
                  <Info className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick Movie Switcher Pills on Mobile */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
                {carouselMovies.map((movie, idx) => {
                  const isSelected = idx === currentSlideIndex;
                  return (
                    <button
                      key={movie.id}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? "bg-[#FFC914] text-black border-[#FFC914] font-black"
                          : "bg-[#141414] text-[#888] border-[#292929] hover:text-white"
                      }`}
                    >
                      {movie.title.split(":")[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* DESKTOP HERO CAROUSEL (>= md)                            */}
          {/* Widescreen Cinematic Theatrical Showcase                 */}
          {/* ======================================================== */}
          <section
            className="hidden md:flex relative w-full overflow-hidden select-none bg-[#080808] items-end md:min-h-[640px] lg:h-[75vh] max-h-[780px] xl:max-h-[820px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Active Movie Background Backdrop with Fade Effect */}
            {/* Layer 1: Ambient Colored Blur */}
            <div
              key={`ambient-${activeMovie.id}`}
              className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-35 scale-110 pointer-events-none transition-all duration-1000"
              style={{
                backgroundImage: `url(${activeMovie.carousel || activeMovie.banner || activeMovie.poster})`
              }}
            />

            {/* Layer 2: Main Crisp 16:9 Theatrical Landscape Banner */}
            <div
              key={`banner-${activeMovie.id}`}
              className="absolute inset-0 flex justify-end items-center pointer-events-none animate-in fade-in duration-700"
            >
              <img
                src={activeMovie.carousel || activeMovie.banner || activeMovie.poster}
                alt={activeMovie.title}
                className="w-full h-full object-cover object-right select-none transition-opacity duration-700 [mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_100%)]"
              />
            </div>

            {/* Layer 3: Controlled Overlays for Desktop */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/85 to-transparent w-full md:w-3/5 lg:w-1/2 pointer-events-none z-10" />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#080808]/70 to-transparent pointer-events-none z-10" />

            {/* Previous / Next Arrow Controls */}
            {carouselMovies.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Previous Slide"
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-13 h-13 rounded-full bg-black/60 hover:bg-[#FFC914] text-white hover:text-black border border-white/20 hover:border-[#FFC914] backdrop-blur-md flex items-center justify-center transition-all shadow-2xl hover:scale-110 cursor-pointer group"
                >
                  <ChevronLeft className="w-7 h-7 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Next Slide"
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-13 h-13 rounded-full bg-black/60 hover:bg-[#FFC914] text-white hover:text-black border border-white/20 hover:border-[#FFC914] backdrop-blur-md flex items-center justify-center transition-all shadow-2xl hover:scale-110 cursor-pointer group"
                >
                  <ChevronRight className="w-7 h-7 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}

            {/* Hero Content Area */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 pb-10 w-full">
              <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
                {/* Left Column: Active Movie Highlight */}
                <div
                  key={`content-${activeMovie.id}`}
                  className="max-w-2xl space-y-3.5 animate-in fade-in slide-in-from-bottom-6 duration-700"
                >
                  {/* Badge & Carousel Counter */}
                  <div className="flex items-center gap-2 max-w-full overflow-hidden">
                    <div className="inline-flex items-center gap-2 bg-[#FFC914]/20 border border-[#FFC914]/50 px-3.5 py-1 rounded-full text-xs font-extrabold text-[#FFC914] shadow-lg shadow-[#FFC914]/15 shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>NOW SHOWING • VADIPATTI</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#888] bg-[#1a1a1a]/80 px-2 py-0.5 rounded border border-[#333] shrink-0">
                      {String(currentSlideIndex + 1).padStart(2, "0")} / {String(carouselMovies.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title with Yellow Accent */}
                  <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
                    {activeMovie.title.split(":")[0]}
                    {activeMovie.title.includes(":") && (
                      <span className="text-[#FFC914] inline">
                        :{activeMovie.title.split(":")[1]}
                      </span>
                    )}
                  </h1>

                  {/* Tagline */}
                  {activeMovie.tagline && (
                    <p className="text-base text-[#FFC914] italic font-semibold line-clamp-1">
                      "{activeMovie.tagline}"
                    </p>
                  )}

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#A1A1AA] pt-0.5">
                    <span className="bg-[#1c1c1c] border border-[#383838] px-2 py-0.5 rounded text-white font-black text-xs">
                      {activeMovie.ageRating}
                    </span>
                    <span className="flex items-center gap-1 text-white bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#333]">
                      <Star className="w-4 h-4 fill-[#FFC914] text-[#FFC914]" />
                      <span className="font-extrabold">{activeMovie.rating}</span>
                      <span className="text-[#777]">/10</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FFC914]" />
                      <span>{activeMovie.duration}</span>
                    </span>
                    <span>•</span>
                    <span className="text-white font-medium">{activeMovie.genre?.join(", ")}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#FFC914]" />
                      <span>{activeMovie.languages?.join(", ")}</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#D4D4D8] line-clamp-2 max-w-xl leading-relaxed">
                    {activeMovie.description}
                  </p>

                  {/* Director & Main Cast */}
                  <div className="text-xs text-[#888] pt-0.5 truncate">
                    <span className="text-[#666]">Starring: </span>
                    <span className="text-[#ccc]">{activeMovie.cast?.slice(0, 3).join(", ")}</span>
                    {activeMovie.director && (
                      <>
                        <span className="mx-2 text-[#444]">•</span>
                        <span className="text-[#666]">Dir: </span>
                        <span className="text-[#ccc]">{activeMovie.director}</span>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => handleBookNow(activeMovie)}
                      className="flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black px-7 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-[#FFC914]/25 hover:scale-105 transition-all cursor-pointer"
                    >
                      <Ticket className="w-4 h-4 fill-black" />
                      <span>Book Tickets</span>
                    </button>

                    <a
                      href={activeMovie.trailerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 bg-[#171717]/85 hover:bg-[#252525] text-white border border-[#383838] px-5 py-3.5 rounded-2xl font-bold text-sm hover:scale-105 transition-all"
                    >
                      <Play className="w-4 h-4 fill-white text-white" />
                      <span>Trailer</span>
                    </a>

                    <Link
                      to={`/movie/${activeMovie.id}`}
                      className="flex items-center gap-1 text-xs text-[#A1A1AA] hover:text-[#FFC914] px-2.5 py-1.5 transition font-semibold"
                    >
                      <Info className="w-4 h-4" />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>

                {/* Right Column: Sleek Mini Movie Previews on XL */}
              <div className="hidden xl:flex flex-col gap-2 w-72 shrink-0 bg-black/40 hover:bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl transition-all">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFC914] flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" />
                    <span>Theatrical Releases ({carouselMovies.length})</span>
                  </span>
                  <span className="text-[10px] text-[#888]">Switch</span>
                </div>

                <div className="space-y-1.5">
                  {carouselMovies.map((movie, idx) => {
                    const isSelected = idx === currentSlideIndex;
                    return (
                      <div
                        key={movie.id}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? "bg-[#1f1a08]/90 border-[#FFC914] shadow-md shadow-[#FFC914]/20 scale-[1.02]"
                            : "bg-[#141414]/70 border-[#262626]/80 hover:bg-[#1c1c1c] hover:border-[#383838]"
                        }`}
                      >
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-9 h-12 object-cover rounded-lg border border-[#333] shrink-0"
                        />
                        <div className="overflow-hidden flex-1">
                          <h4
                            className={`text-xs font-black truncate ${
                              isSelected ? "text-[#FFC914]" : "text-white"
                            }`}
                          >
                            {movie.title}
                          </h4>
                          <p className="text-[10px] text-[#888] truncate mt-0.5">
                            {movie.genre?.[0]} • {movie.duration}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-[#FFC914] flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-[#FFC914]" />
                              {movie.rating}
                            </span>
                            <span className="text-[9px] bg-[#222] px-1 py-0.2 rounded text-[#bbb]">
                              {movie.ageRating}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-[#FFC914] animate-pulse shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Carousel Progress Bars & Quick Switchers */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 sm:pt-5 border-t border-white/10 mt-3 sm:mt-5">
              {/* Dots / Bars & Movie Pills */}
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-full pb-1">
                <div className="flex items-center gap-1.5 shrink-0">
                  {carouselMovies.map((movie, idx) => {
                    const isSelected = idx === currentSlideIndex;
                    return (
                      <button
                        key={movie.id}
                        onClick={() => setCurrentSlideIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "w-7 sm:w-10 bg-[#FFC914] shadow-sm shadow-[#FFC914]"
                            : "w-2 sm:w-2.5 bg-[#333] hover:bg-[#555]"
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Quick movie switcher buttons on non-XL screens */}
                <div className="flex xl:hidden items-center gap-1.5 overflow-x-auto">
                  {carouselMovies.map((movie, idx) => {
                    const isSelected = idx === currentSlideIndex;
                    return (
                      <button
                        key={movie.id}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? "bg-[#FFC914] text-black border-[#FFC914]"
                            : "bg-[#181818] text-[#888] border-[#333] hover:text-white"
                        }`}
                      >
                        {movie.title.split(":")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status pill */}
              <div className="text-[10px] sm:text-[11px] text-[#888] flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="font-medium text-[#ccc]">Vadipatti G2 Multiplex • Screens 1 & 2</span>
              </div>
            </div>
          </div>
        </section>
        </>
      )}

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Filter Tabs: Now Showing vs Coming Soon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
          <div className="flex items-center gap-2 bg-[#141414] p-1 rounded-xl border border-[#292929]">
            <button
              onClick={() => setActiveTab("NOW_SHOWING")}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "NOW_SHOWING"
                  ? "bg-[#FFC914] text-black shadow-md"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Now Showing ({nowShowing.length})
            </button>
            <button
              onClick={() => setActiveTab("COMING_SOON")}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "COMING_SOON"
                  ? "bg-[#FFC914] text-black shadow-md"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Coming Soon ({comingSoon.length})
            </button>
          </div>

          <Link
            to="/movies"
            className="flex items-center gap-1.5 text-xs text-[#FFC914] hover:text-[#EAB308] font-bold group"
          >
            <span>View All Movies</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Movies Grid - 2 Movies Per Row on Mobile */}
        {(activeTab === "NOW_SHOWING" ? nowShowing : comingSoon).length === 0 ? (
          <div className="text-center py-16 bg-[#141414] rounded-2xl border border-[#292929] p-8 space-y-2">
            <Film className="w-10 h-10 text-[#444] mx-auto" />
            <h3 className="font-bold text-white text-sm">All Current Blockbusters Are Live in Theatres</h3>
            <p className="text-xs text-[#888]">
              All 3 major theatrical releases are currently Now Showing. Book tickets above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
            {(activeTab === "NOW_SHOWING" ? nowShowing : comingSoon).map((movie) => (
              <div
                key={movie.id}
                className="group bg-[#171717] rounded-xl sm:rounded-2xl border border-[#292929] overflow-hidden hover:border-[#FFC914]/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#FFC914]/5"
              >
                {/* Poster Container */}
                <div className="relative aspect-[2/3] overflow-hidden bg-[#111]">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent opacity-80" />

                  {/* Rating Badge */}
                  <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 bg-[#080808]/85 backdrop-blur-md border border-[#333] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg flex items-center gap-1 text-[10px] sm:text-xs font-bold text-white">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#FFC914] text-[#FFC914]" />
                    <span>{movie.rating}</span>
                  </div>

                  {/* Age & Format Badge */}
                  <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 bg-[#080808]/85 backdrop-blur-md border border-[#333] px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-bold text-[#FFC914]">
                    {movie.ageRating}
                  </div>
                </div>

                {/* Details */}
                <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between overflow-hidden">
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
                        onClick={() => handleBookNow(movie)}
                        className="w-full py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-[11px] sm:text-xs transition-all shadow-md shadow-[#FFC914]/15 flex items-center justify-center gap-1 cursor-pointer mt-1"
                      >
                        <Ticket className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black" />
                        <span>Book Now</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#222] text-[#666] font-bold text-[11px] sm:text-xs cursor-not-allowed mt-1"
                      >
                        Releasing Soon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Promotional Banner */}
        <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#171717] via-[#221c08] to-[#171717] border border-[#FFC914]/30 p-5 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-extrabold text-[#FFC914]">
              G2 CINEMAS GOURMET COMBO
            </span>
            <h2 className="text-xl sm:text-4xl font-black text-white leading-tight">
              Order Fresh Canteen Snacks Delivered Straight To Your Seat!
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              No waiting in lines during intermission. Browse gourmet popcorn tubs, artisanal burgers, and chilled sodas, and our staff will deliver directly to your cinema recliner.
            </p>
            <div className="pt-1 sm:pt-2">
              <Link
                to="/food"
                className="inline-flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-extrabold text-xs transition shadow-lg shadow-[#FFC914]/20"
              >
                <span>Browse Snack Bar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Cinema Experience Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-[#111111] p-6 rounded-2xl border border-[#292929] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFC914]/15 flex items-center justify-center text-[#FFC914]">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">IMAX 4K Laser Projection</h3>
            <p className="text-xs text-[#888] leading-relaxed">
              Crystal-clear images and next-generation dual-laser projection paired with customized stadium seating for maximum immersion.
            </p>
          </div>

          <div className="bg-[#111111] p-6 rounded-2xl border border-[#292929] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFC914]/15 flex items-center justify-center text-[#FFC914]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">Dolby Atmos Spatial Sound</h3>
            <p className="text-xs text-[#888] leading-relaxed">
              64-channel immersive audio that moves around you in three-dimensional space, capturing every whisper and explosion.
            </p>
          </div>

          <div className="bg-[#111111] p-6 rounded-2xl border border-[#292929] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFC914]/15 flex items-center justify-center text-[#FFC914]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">VIP Plush Recliners</h3>
            <p className="text-xs text-[#888] leading-relaxed">
              Electronic motorized leather recliners with USB charging ports, personal call buttons, and ambient table lamps.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
