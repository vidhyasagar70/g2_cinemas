import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Globe,
  Calendar,
  Film,
  User,
  Shield,
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import { getAvailableDates } from "../../data/shows";
import { BookingProgress } from "../../components/booking/BookingProgress";
import toast from "react-hot-toast";

export const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movies, shows, screens } = useApp();
  const { selectMovie, selectShow } = useBooking();
  const { isAuthenticated } = useAuth();

  const movie = movies.find((m) => m.id === id) || movies[0];
  const availableDates = useMemo(() => getAvailableDates(), []);
  const [selectedDate, setSelectedDate] = useState(availableDates[0].dateStr);

  // Filter shows for this movie and selected date
  const filteredShows = useMemo(() => {
    return shows.filter(
      (s) => s.movieId === movie.id && s.date === selectedDate
    );
  }, [shows, movie.id, selectedDate]);

  // Group shows by screen
  const showsByScreen = useMemo(() => {
    const map = {};
    screens.forEach((sc) => {
      map[sc.id] = {
        screen: sc,
        shows: []
      };
    });

    filteredShows.forEach((show) => {
      if (map[show.screenId]) {
        map[show.screenId].shows.push(show);
      }
    });

    return Object.values(map);
  }, [screens, filteredShows]);

  const handleSelectShowtime = (show) => {
    if (show.status === "Sold Out") {
      toast.error("This showtime is completely sold out. Please pick another time.");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please sign in to choose seats and book tickets.");
      navigate("/login", { state: { from: `/movie/${movie.id}` } });
      return;
    }
    selectMovie(movie);
    selectShow(show, selectedDate);
    navigate("/book/seats");
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Booking Progress Indicator */}
      <BookingProgress currentStep={1} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Movie Header & Banner Card */}
        <div className="relative rounded-3xl overflow-hidden bg-[#141414] border border-[#292929] shadow-2xl">
          {/* Banner Backdrop */}
          <div
            className="w-full h-80 sm:h-96 bg-cover bg-center relative"
            style={{
              backgroundImage: `url(${movie.banner || movie.poster})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/75 to-transparent" />
          </div>

          {/* Overlapping Movie Information */}
          <div className="relative -mt-36 sm:-mt-48 p-4 sm:p-10 flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start">
            {/* Poster Card */}
            <div className="w-40 sm:w-60 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#292929] shrink-0 bg-[#0d0d0d] mx-auto md:mx-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Column */}
            <div className="space-y-3 sm:space-y-4 flex-1 w-full text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#FFC914]/15 border border-[#FFC914]/40 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#FFC914]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXPERIENCE IN ULTRA HD LASER & ATMOS</span>
              </div>

              <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-xs sm:text-base text-[#FFC914] italic font-medium">
                  "{movie.tagline}"
                </p>
              )}

              {/* Meta Tags */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-xs sm:text-sm text-[#A1A1AA]">
                <span className="bg-[#222] border border-[#333] px-2 py-0.5 rounded text-white font-bold text-[11px] sm:text-xs">
                  {movie.ageRating}
                </span>
                <span className="flex items-center gap-1 text-white bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#333]">
                  <Star className="w-3.5 h-3.5 fill-[#FFC914] text-[#FFC914]" />
                  <span className="font-bold">{movie.rating}</span>/10
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#FFC914]" />
                  {movie.duration}
                </span>
                <span>•</span>
                <span>{movie.genre?.join(", ")}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#FFC914]" />
                  {movie.languages?.join(", ")}
                </span>
              </div>

              {/* Synopsis */}
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-3xl">
                {movie.description}
              </p>

              {/* Cast & Crew Pill Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#222]">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#666] font-bold block mb-1">
                    Director
                  </span>
                  <span className="text-xs font-semibold text-white">{movie.director}</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#666] font-bold block mb-1">
                    Starring Cast
                  </span>
                  <span className="text-xs font-semibold text-[#A1A1AA]">
                    {movie.cast?.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5.3 Showtime Selection Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Select Date & Showtime
              </h2>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Choose your preferred screen format and auditorium timing.
              </p>
            </div>

            {/* Quick Status Legend */}
            <div className="hidden sm:flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-[#22C55E]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                Available
              </span>
              <span className="flex items-center gap-1.5 text-[#F59E0B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                Filling Fast
              </span>
              <span className="flex items-center gap-1.5 text-[#666]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#444]" />
                Sold Out
              </span>
            </div>
          </div>

          {/* Horizontal Date Cards Selector */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {availableDates.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              return (
                <button
                  key={item.dateStr}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`min-w-[85px] sm:min-w-[95px] p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#FFC914] text-black border-[#FFC914] shadow-lg shadow-[#FFC914]/25 scale-105 font-bold"
                      : "bg-[#141414] hover:bg-[#1f1f1f] border-[#292929] text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-wider block font-semibold opacity-80">
                    {item.day}
                  </span>
                  <span className="text-xl sm:text-2xl font-black block my-0.5">
                    {item.dateNum}
                  </span>
                  <span className="text-[10px] uppercase font-bold block opacity-75">
                    {item.month}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Showtimes Grouped by Screen */}
          <div className="space-y-4">
            {showsByScreen.map((group) => (
              <div
                key={group.screen.id}
                className="bg-[#111111] rounded-2xl border border-[#292929] p-5 sm:p-6 space-y-4"
              >
                {/* Screen Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#FFC914]" />
                    <h3 className="font-bold text-base text-white">
                      {group.screen.name}
                    </h3>
                    <span className="text-xs bg-[#1a1a1a] text-[#888] px-2.5 py-0.5 rounded border border-[#333]">
                      {group.screen.type}
                    </span>
                  </div>

                  <div className="text-xs text-[#888]">
                    Recliner ₹{group.screen.categories.find((c) => c.name === "Recliner")?.price || 420} •
                    Premium ₹{group.screen.categories.find((c) => c.name === "Premium")?.price || 290} •
                    Standard ₹{group.screen.categories.find((c) => c.name === "Standard")?.price || 190}
                  </div>
                </div>

                {/* Showtimes Grid */}
                {group.shows.length === 0 ? (
                  <p className="text-xs text-[#666] italic py-2">
                    No shows scheduled on this screen for {selectedDate}.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3">
                    {group.shows.map((show) => {
                      const isSoldOut = show.status === "Sold Out";
                      const isFillingFast = show.status === "Filling Fast";

                      return (
                        <button
                          key={show.id}
                          disabled={isSoldOut}
                          onClick={() => handleSelectShowtime(show)}
                          className={`p-2.5 sm:p-3.5 rounded-xl border text-center transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                            isSoldOut
                              ? "bg-[#181818] border-[#292929] opacity-45 cursor-not-allowed"
                              : "bg-[#171717] hover:bg-[#222222] border-[#292929] hover:border-[#FFC914] group hover:scale-[1.02]"
                          }`}
                        >
                          <div>
                            <span className="text-sm font-extrabold text-white group-hover:text-[#FFC914] transition-colors block">
                              {show.time}
                            </span>
                            <span className="text-[10px] text-[#777] block mt-0.5">
                              {show.format}
                            </span>
                          </div>

                          <div className="mt-2.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                                isSoldOut
                                  ? "bg-[#333] text-[#777]"
                                  : isFillingFast
                                  ? "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30"
                                  : "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                              }`}
                            >
                              {show.status}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

