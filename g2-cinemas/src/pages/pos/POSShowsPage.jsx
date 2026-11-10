import React from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const POSShowsPage = () => {
  const { shows, movies } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#292929] pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Auditorium Schedule & Shows</h1>
          <p className="text-xs text-[#888]">
            Current daily screening timetable across Screen 1, 2, and 3.
          </p>
        </div>

        <Link
          to="/pos/new-ticket"
          className="bg-[#FFC914] text-black font-extrabold text-xs px-4 py-2 rounded-xl hover:bg-[#EAB308]"
        >
          Book Walk-in Ticket
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.map((show) => {
          const movie = movies.find((m) => m.id === show.movieId) || {};
          const isSoldOut = show.status === "Sold Out";
          const bookedCount = show.bookedSeats?.length || 0;

          return (
            <div
              key={show.id}
              className="bg-[#141414] rounded-2xl border border-[#292929] p-5 space-y-4 hover:border-[#444] transition"
            >
              <div className="flex gap-3">
                {movie.poster && (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-14 h-20 object-cover rounded-xl border border-[#333] shrink-0"
                  />
                )}
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white line-clamp-1">
                    {movie.title || "Movie Title"}
                  </h3>
                  <p className="text-xs text-[#FFC914] font-semibold">{show.screenName}</p>
                  <div className="text-[11px] text-[#888] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#FFC914]" />
                    <span className="font-bold text-white">{show.time}</span>
                    <span>•</span>
                    <span>{show.date}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1c1c1c] p-3 rounded-xl border border-[#2a2a2a] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#888] block text-[10px] uppercase">Occupancy</span>
                  <span className="font-bold text-white">{bookedCount} Seats Booked</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isSoldOut
                      ? "bg-red-500/20 text-red-400"
                      : show.status === "Filling Fast"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {show.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
