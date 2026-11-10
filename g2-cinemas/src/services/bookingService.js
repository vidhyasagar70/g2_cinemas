import { INITIAL_BOOKINGS } from "../data/bookings";
import { movieService } from "./movieService";
import { canteenService } from "./canteenService";

const BOOKINGS_KEY = "g2_cinemas_bookings";

export const bookingService = {
  getBookings: () => {
    try {
      const data = localStorage.getItem(BOOKINGS_KEY);
      return data ? JSON.parse(data) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  saveBookings: (bookings) => {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error("Error saving bookings to localStorage", e);
    }
  },

  getBookingById: (id) => {
    const bookings = bookingService.getBookings();
    return bookings.find((b) => b.id === id);
  },

  createBooking: ({
    movie,
    show,
    selectedSeats,
    foodCart = [],
    deliveryOption = "NONE",
    deliveryDetails = null,
    customer,
    paymentMethod = "UPI",
    source = "ONLINE"
  }) => {
    const bookings = bookingService.getBookings();
    const bookingNum = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `G2-${bookingNum}`;

    // Calculate seat prices
    let ticketAmount = 0;
    selectedSeats.forEach((seat) => {
      ticketAmount += seat.price;
    });

    // Calculate food amount
    let foodAmount = 0;
    foodCart.forEach((item) => {
      foodAmount += item.price * item.quantity;
    });

    const convenienceFee = source === "ONLINE" ? Math.round(ticketAmount * 0.05 + 20) : 0;
    const totalAmount = ticketAmount + foodAmount + convenienceFee;

    // Create canteen order if food items exist
    let canteenOrderId = null;
    if (foodCart && foodCart.length > 0) {
      const order = canteenService.createOrder({
        bookingId,
        customerName: customer.name || "Walk-in Guest",
        customerMobile: customer.mobile || "",
        orderType: deliveryOption === "SEAT_DELIVERY" ? "SEAT_DELIVERY" : "COUNTER_PICKUP",
        screen: show.screenName,
        seats: selectedSeats.map((s) => s.id).join(", "),
        items: foodCart,
        instructions: deliveryDetails?.instructions || ""
      });
      canteenOrderId = order.id;
    }

    // Mark seats as booked in show
    const currentShows = movieService.getShows();
    const targetShow = currentShows.find((s) => s.id === show.id);
    if (targetShow) {
      const seatIds = selectedSeats.map((s) => s.id);
      const updatedBookedSeats = Array.from(new Set([...(targetShow.bookedSeats || []), ...seatIds]));
      movieService.updateShow(show.id, { bookedSeats: updatedBookedSeats });
    }

    const newBooking = {
      id: bookingId,
      customerName: customer.name || "Customer",
      customerMobile: customer.mobile || "",
      customerEmail: customer.email || "",
      source,
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.poster,
      screenId: show.screenId,
      screenName: show.screenName,
      showDate: show.date,
      showTime: show.time,
      format: show.format,
      seats: selectedSeats.map((s) => s.id),
      seatDetails: selectedSeats,
      ticketCount: selectedSeats.length,
      ticketAmount,
      foodAmount,
      convenienceFee,
      totalAmount,
      foodItems: foodCart,
      deliveryOption,
      deliveryDetails,
      paymentMethod,
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
      bookedAt: new Date().toISOString(),
      canteenOrderId
    };

    const updated = [newBooking, ...bookings];
    bookingService.saveBookings(updated);
    return newBooking;
  },

  cancelBooking: (id) => {
    const bookings = bookingService.getBookings();
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return null;

    // Free up seats in the show
    const shows = movieService.getShows();
    const targetShow = shows.find(
      (s) => s.movieId === booking.movieId && s.date === booking.showDate && s.time === booking.showTime
    );
    if (targetShow) {
      const updatedBookedSeats = (targetShow.bookedSeats || []).filter(
        (seatId) => !booking.seats.includes(seatId)
      );
      movieService.updateShow(targetShow.id, { bookedSeats: updatedBookedSeats });
    }

    const updated = bookings.map((b) =>
      b.id === id ? { ...b, bookingStatus: "CANCELLED" } : b
    );
    bookingService.saveBookings(updated);
    return updated.find((b) => b.id === id);
  }
};

