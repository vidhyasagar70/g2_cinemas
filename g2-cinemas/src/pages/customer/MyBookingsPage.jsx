import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Film,
  Utensils,
  UtensilsCrossed,
  Eye,
  XCircle,
  PlusCircle,
  ArrowRight,
  Armchair,
  ShoppingBag,
  CheckCircle2,
  Printer,
  X,
  Sparkles,
  Receipt,
  AlertCircle
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { TicketModal } from "../../components/booking/TicketModal";

export const MyBookingsPage = () => {
  const { customerBookings, cancelBooking, customerOrders } = useApp();
  const { isAuthenticated, user } = useAuth();

  // Top-level Section: MOVIES vs SNACKS
  const [mainSection, setMainSection] = useState("MOVIES"); // "MOVIES" | "SNACKS"

  // Movie Tickets sub-tab filter: UPCOMING vs CANCELLED
  const [movieTab, setMovieTab] = useState("UPCOMING");

  // Snack Orders sub-tab filter: ALL vs PREPARING vs COMPLETED
  const [snackTab, setSnackTab] = useState("ALL");

  // Modals state
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);

  // Unauthenticated view
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#1f1a08] border border-[#FFC914]/40 flex items-center justify-center text-[#FFC914] mx-auto shadow-xl shadow-[#FFC914]/10">
          <Ticket className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Sign In to View Your Bookings</h2>
          <p className="text-xs text-[#888] leading-relaxed">
            Please sign in to your G2 Cinemas account to access your digital tickets, seat passes, and canteen orders.
          </p>
        </div>
        <Link
          to="/login"
          state={{ from: "/my-bookings" }}
          className="inline-flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black font-black px-6 py-3 rounded-2xl text-xs transition shadow-lg shadow-[#FFC914]/20"
        >
          <span>Sign In to G2 Cinemas</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Filtered Movie Bookings for Customer Session
  const filteredBookings = customerBookings.filter((b) => {
    if (movieTab === "CANCELLED") {
      return b.bookingStatus === "CANCELLED";
    }
    if (b.bookingStatus === "CANCELLED") return false;
    return movieTab === "UPCOMING" ? true : false;
  });

  // Filtered Snack Orders for Customer Session
  const filteredOrders = useMemo(() => {
    return customerOrders.filter((o) => {
      if (snackTab === "PREPARING") {
        return o.status === "NEW" || o.status === "PREPARING";
      }
      if (snackTab === "COMPLETED") {
        return o.status === "READY" || o.status === "DELIVERED" || o.status === "COLLECTED";
      }
      return true; // "ALL"
    });
  }, [customerOrders, snackTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292929] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#FFC914] block mb-1">
            G2 CINEMAS • VADIPATTI
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            My Bookings & Orders
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Access your movie tickets, auditorium seat deliveries, and digital canteen passes.
          </p>
        </div>

        {mainSection === "MOVIES" ? (
          <Link
            to="/movies"
            className="flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black px-5 py-2.5 rounded-xl text-xs font-black transition shadow-md shadow-[#FFC914]/20 self-start sm:self-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book Another Movie</span>
          </Link>
        ) : (
          <Link
            to="/food"
            className="flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black px-5 py-2.5 rounded-xl text-xs font-black transition shadow-md shadow-[#FFC914]/20 self-start sm:self-center"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Order More Snacks</span>
          </Link>
        )}
      </div>

      {/* 2 MAIN SECTIONS SELECTOR: MOVIE TICKETS vs SNACKS ORDERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Section 1: Movie Tickets */}
        <button
          type="button"
          onClick={() => setMainSection("MOVIES")}
          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between text-left cursor-pointer ${
            mainSection === "MOVIES"
              ? "bg-[#1f1a08] border-[#FFC914] shadow-xl shadow-[#FFC914]/15 scale-[1.01]"
              : "bg-[#141414] border-[#292929] hover:bg-[#1a1a1a] hover:border-[#444]"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                mainSection === "MOVIES"
                  ? "bg-[#FFC914] text-black"
                  : "bg-[#222] text-[#888]"
              }`}
            >
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-base font-black ${
                    mainSection === "MOVIES" ? "text-white" : "text-[#ccc]"
                  }`}
                >
                  Movie Tickets
                </h3>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    mainSection === "MOVIES"
                      ? "bg-[#FFC914] text-black"
                      : "bg-[#222] text-[#888]"
                  }`}
                >
                  {customerBookings.length}
                </span>
              </div>
              <p className="text-xs text-[#888] mt-0.5">
                Theatrical showtimes, digital barcodes & seats
              </p>
            </div>
          </div>
          {mainSection === "MOVIES" && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFC914] shadow-sm shadow-[#FFC914]" />
          )}
        </button>

        {/* Section 2: Snacks & Canteen Orders */}
        <button
          type="button"
          onClick={() => setMainSection("SNACKS")}
          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between text-left cursor-pointer ${
            mainSection === "SNACKS"
              ? "bg-[#1f1a08] border-[#FFC914] shadow-xl shadow-[#FFC914]/15 scale-[1.01]"
              : "bg-[#141414] border-[#292929] hover:bg-[#1a1a1a] hover:border-[#444]"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                mainSection === "SNACKS"
                  ? "bg-[#FFC914] text-black"
                  : "bg-[#222] text-[#888]"
              }`}
            >
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-base font-black ${
                    mainSection === "SNACKS" ? "text-white" : "text-[#ccc]"
                  }`}
                >
                  Snacks & Canteen Orders
                </h3>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    mainSection === "SNACKS"
                      ? "bg-[#FFC914] text-black"
                      : "bg-[#222] text-[#888]"
                  }`}
                >
                  {customerOrders.length}
                </span>
              </div>
              <p className="text-xs text-[#888] mt-0.5">
                Auditorium seat deliveries & pickup tokens
              </p>
            </div>
          </div>
          {mainSection === "SNACKS" && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFC914] shadow-sm shadow-[#FFC914]" />
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: MOVIE TICKETS VIEW                           */}
      {/* ======================================================== */}
      {mainSection === "MOVIES" && (
        <div className="space-y-6">
          {/* Sub-Tabs: Upcoming vs Cancelled */}
          <div className="flex items-center gap-2 border-b border-[#222] pb-3">
            {[
              {
                id: "UPCOMING",
                label: "Upcoming Shows",
                count: customerBookings.filter((b) => b.bookingStatus !== "CANCELLED").length
              },
              {
                id: "CANCELLED",
                label: "Cancelled",
                count: customerBookings.filter((b) => b.bookingStatus === "CANCELLED").length
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMovieTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  movieTab === tab.id
                    ? "bg-[#171717] text-[#FFC914] border border-[#FFC914]/40"
                    : "text-[#888] hover:text-white hover:bg-[#141414]"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] bg-[#222] px-1.5 py-0.2 rounded-full text-[#aaa]">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-[#141414] rounded-3xl border border-[#292929] p-8 space-y-4">
              <Ticket className="w-12 h-12 text-[#444] mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white">No Movie Tickets Found</h3>
                <p className="text-xs text-[#888] mt-1">
                  You haven't booked any movie tickets in this category yet.
                </p>
              </div>
              <Link
                to="/movies"
                className="inline-flex items-center gap-2 bg-[#FFC914] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-[#EAB308]"
              >
                <span>Explore Now Showing Movies</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#141414] rounded-3xl border border-[#292929] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#383838] transition-all"
                >
                  {/* Left: Poster & Details */}
                  <div className="flex gap-4 items-start">
                    {b.moviePoster && (
                      <img
                        src={b.moviePoster}
                        alt={b.movieTitle}
                        className="w-20 h-28 object-cover rounded-2xl border border-[#333] shadow-md shrink-0"
                      />
                    )}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#FFC914] bg-[#221c08] border border-[#FFC914]/30 px-2 py-0.5 rounded">
                          {b.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.bookingStatus === "CANCELLED"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-green-500/20 text-green-400 border border-green-500/30"
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-white">{b.movieTitle}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#888]">
                        <span className="text-[#ddd] font-semibold">{b.screenName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#FFC914]" />
                          {b.showDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#FFC914]" />
                          {b.showTime}
                        </span>
                      </div>

                      <div className="text-xs pt-1">
                        <span className="text-[#888]">Seats: </span>
                        <span className="font-mono font-bold text-white">
                          {Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}
                        </span>
                        <span className="text-[#888] ml-2">({b.ticketCount} Tickets)</span>
                      </div>

                      {b.foodItems && b.foodItems.length > 0 && (
                        <div className="text-[11px] text-[#FFC914] flex items-center gap-1.5 pt-0.5">
                          <Utensils className="w-3.5 h-3.5" />
                          <span>
                            Includes {b.foodItems.length} Canteen Items ({b.deliveryOption === "SEAT_DELIVERY" ? "Seat Delivery" : "Counter Pickup"})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Total & Action Buttons */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-[#222] pt-4 md:pt-0 gap-4">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-[#888] block">Total Amount</span>
                      <span className="text-lg font-black text-white">₹{b.totalAmount}</span>
                      <span className="text-[10px] text-[#666] block">{b.paymentMethod} Paid</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBookingForModal(b)}
                        className="flex items-center gap-1.5 bg-[#FFC914] hover:bg-[#EAB308] text-black px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-md shadow-[#FFC914]/20 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Ticket</span>
                      </button>

                      {b.bookingStatus !== "CANCELLED" && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to cancel booking ${b.id}?`)) {
                              cancelBooking(b.id);
                            }
                          }}
                          title="Cancel Booking Demo"
                          className="p-2 rounded-xl bg-[#222] hover:bg-red-950/40 text-[#888] hover:text-red-400 border border-[#333] transition cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: SNACKS & CANTEEN ORDERS VIEW                 */}
      {/* ======================================================== */}
      {mainSection === "SNACKS" && (
        <div className="space-y-6">
          {/* Sub-Tabs: All, In Kitchen, Completed */}
          <div className="flex items-center gap-2 border-b border-[#222] pb-3">
            {[
              { id: "ALL", label: "All Snack Orders", count: customerOrders.length },
              {
                id: "PREPARING",
                label: "In Kitchen / Preparing",
                count: customerOrders.filter((o) => o.status === "NEW" || o.status === "PREPARING").length
              },
              {
                id: "COMPLETED",
                label: "Ready / Delivered",
                count: customerOrders.filter((o) => o.status === "READY" || o.status === "DELIVERED" || o.status === "COLLECTED").length
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSnackTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  snackTab === tab.id
                    ? "bg-[#171717] text-[#FFC914] border border-[#FFC914]/40"
                    : "text-[#888] hover:text-white hover:bg-[#141414]"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] bg-[#222] px-1.5 py-0.2 rounded-full text-[#aaa]">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Snack Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-[#141414] rounded-3xl border border-[#292929] p-8 space-y-4">
              <UtensilsCrossed className="w-12 h-12 text-[#444] mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white">No Snack Orders Found</h3>
                <p className="text-xs text-[#888] mt-1">
                  You haven't ordered any snacks in this category yet.
                </p>
              </div>
              <Link
                to="/food"
                className="inline-flex items-center gap-2 bg-[#FFC914] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-[#EAB308]"
              >
                <span>Browse Canteen Menu & Order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isSeatDelivery = order.orderType === "SEAT_DELIVERY";

                // Status configuration
                const statusInfo = {
                  NEW: {
                    bg: "bg-[#FFC914]/15",
                    border: "border-[#FFC914]/40",
                    text: "text-[#FFC914]",
                    label: "NEW ORDER RECEIVED"
                  },
                  PREPARING: {
                    bg: "bg-blue-500/15",
                    border: "border-blue-500/40",
                    text: "text-blue-400",
                    label: "PREPARING IN KITCHEN"
                  },
                  READY: {
                    bg: "bg-green-500/15",
                    border: "border-green-500/40",
                    text: "text-green-400",
                    label: "READY FOR DISPATCH"
                  },
                  DELIVERED: {
                    bg: "bg-neutral-800",
                    border: "border-neutral-700",
                    text: "text-neutral-400",
                    label: "DELIVERED TO SEAT"
                  },
                  COLLECTED: {
                    bg: "bg-neutral-800",
                    border: "border-neutral-700",
                    text: "text-neutral-400",
                    label: "COLLECTED AT COUNTER"
                  }
                }[order.status] || {
                  bg: "bg-neutral-800",
                  border: "border-neutral-700",
                  text: "text-neutral-400",
                  label: order.status
                };

                return (
                  <div
                    key={order.id}
                    className="bg-[#141414] rounded-3xl border border-[#292929] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#383838] transition-all shadow-lg"
                  >
                    {/* Left: Destination & Snack Details */}
                    <div className="space-y-3 flex-1">
                      {/* Top tokens row */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono font-black text-sm text-[#FFC914] bg-[#221c08] border border-[#FFC914]/30 px-2.5 py-0.5 rounded-lg">
                          {order.id}
                        </span>

                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.text} flex items-center gap-1.5`}
                        >
                          {(order.status === "NEW" || order.status === "PREPARING") && (
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          )}
                          <span>{statusInfo.label}</span>
                        </span>

                        <span className="text-[11px] text-[#777] font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#888]" />
                          <span>{order.orderTime}</span>
                        </span>
                      </div>

                      {/* Destination Badge */}
                      <div className="bg-[#1a1a1a] p-3 rounded-2xl border border-[#262626] flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSeatDelivery
                              ? "bg-[#FFC914]/15 border border-[#FFC914]/30 text-[#FFC914]"
                              : "bg-[#252525] border border-[#333] text-[#888]"
                          }`}
                        >
                          {isSeatDelivery ? (
                            <Armchair className="w-5 h-5" />
                          ) : (
                            <ShoppingBag className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#888] block">
                            {isSeatDelivery ? "Auditorium Seat Delivery" : "Express Counter Pickup"}
                          </span>
                          <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                            <span className="text-[#FFC914]">{order.screen}</span>
                            {order.seats && order.seats !== "-" && (
                              <>
                                <span className="text-[#666]">•</span>
                                <span>Seat {order.seats}</span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Ordered Items List */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] text-[#888] font-bold block">
                          Ordered Refreshments ({order.items?.reduce((s, i) => s + i.quantity, 0)} items):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {order.items?.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-[#ddd] bg-[#1d1d1d] border border-[#2e2e2e] px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                            >
                              <span className="text-[#FFC914] font-bold">{item.quantity}x</span>
                              <span>{item.name}</span>
                              <span className="text-[10px] text-[#777]">(₹{item.price * item.quantity})</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Instructions if provided */}
                      {order.instructions && (
                        <p className="text-[11px] text-[#A1A1AA] italic pt-0.5">
                          Note: "{order.instructions}"
                        </p>
                      )}
                    </div>

                    {/* Right: Price & Digital Receipt Button */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-[#222] pt-4 md:pt-0 gap-4 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[11px] text-[#888] block">Total Paid</span>
                        <span className="text-xl font-black text-[#FFC914]">
                          ₹{order.totalAmount}
                        </span>
                        <span className="text-[10px] text-[#22C55E] block font-semibold">
                          Online Canteen Pay
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedOrderForModal(order)}
                        className="flex items-center gap-1.5 bg-[#FFC914] hover:bg-[#EAB308] text-black px-4 py-2 rounded-xl text-xs font-black transition shadow-md shadow-[#FFC914]/20 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View Snack Pass</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* POPUP 1: TICKET MODAL FOR MOVIE BOOKING                  */}
      {/* ======================================================== */}
      {selectedBookingForModal && (
        <TicketModal
          booking={selectedBookingForModal}
          onClose={() => setSelectedBookingForModal(null)}
        />
      )}

      {/* ======================================================== */}
      {/* POPUP 2: DIGITAL SNACK PASS MODAL FOR SNACK ORDERS      */}
      {/* ======================================================== */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#141414] border border-[#292929] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#292929] bg-[#101010]">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#FFC914]" />
                <span className="font-bold text-white text-sm">G2 Digital Canteen Pass</span>
              </div>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="p-1 rounded-lg text-[#888] hover:text-white hover:bg-[#222] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Pass Body */}
            <div id="printable-snack-pass" className="p-6 overflow-y-auto space-y-6">
              {/* Cinema Header */}
              <div className="flex items-center justify-between border-b border-dashed border-[#333] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFC914] text-black font-black flex items-center justify-center text-lg shadow-md shadow-[#FFC914]/20">
                    G2
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-wider">
                      G2 CINEMAS
                    </h3>
                    <p className="text-[11px] text-[#888]">Vadipatti, Tamil Nadu 625218</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#888] block">
                    Order Token
                  </span>
                  <span className="font-mono font-black text-[#FFC914] text-lg">
                    {selectedOrderForModal.id}
                  </span>
                </div>
              </div>

              {/* Delivery Details Card */}
              <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-[#2a2a2a] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Service Type:</span>
                  <span className="font-bold text-white">
                    {selectedOrderForModal.orderType === "SEAT_DELIVERY"
                      ? "Auditorium Seat Delivery"
                      : "Express Counter Pickup"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Auditorium Screen:</span>
                  <span className="font-extrabold text-[#FFC914]">
                    {selectedOrderForModal.screen}
                  </span>
                </div>
                {selectedOrderForModal.seats && selectedOrderForModal.seats !== "-" && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#888]">Seat Number:</span>
                    <span className="font-mono font-bold text-white bg-[#222] px-2 py-0.5 rounded border border-[#333]">
                      Seat {selectedOrderForModal.seats}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Guest Name:</span>
                  <span className="font-bold text-white">
                    {selectedOrderForModal.customerName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Order Placed:</span>
                  <span className="font-mono text-[#aaa]">
                    {selectedOrderForModal.orderTime}
                  </span>
                </div>
              </div>

              {/* Itemized Snacks Table */}
              <div className="space-y-2 border-b border-dashed border-[#333] pb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#888] block">
                  Canteen Items
                </span>
                <div className="space-y-1.5 text-xs">
                  {selectedOrderForModal.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[#ccc]">
                      <span>
                        {item.name} <span className="text-[#FFC914]">x{item.quantity}</span>
                      </span>
                      <span className="font-mono font-bold text-white">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[#262626] font-bold text-sm">
                  <span className="text-white">Total Amount Paid</span>
                  <span className="text-lg font-black text-[#FFC914]">
                    ₹{selectedOrderForModal.totalAmount}
                  </span>
                </div>
              </div>

              {/* QR Code for Kitchen Verification */}
              <div className="text-center space-y-3">
                <div className="inline-block p-3 bg-white rounded-2xl shadow-lg">
                  <QRCodeSVG
                    value={JSON.stringify({
                      token: selectedOrderForModal.id,
                      screen: selectedOrderForModal.screen,
                      seats: selectedOrderForModal.seats,
                      guest: selectedOrderForModal.customerName,
                      total: selectedOrderForModal.totalAmount
                    })}
                    size={130}
                    level="M"
                  />
                </div>
                <p className="text-[10px] text-[#777]">
                  Scan to verify order with G2 Canteen Kitchen Display
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between p-4 bg-[#101010] border-t border-[#292929]">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#888] hover:text-white hover:bg-[#222] transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass</span>
              </button>

              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="px-6 py-2 rounded-xl bg-[#FFC914] text-black font-extrabold text-xs hover:bg-[#EAB308] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
