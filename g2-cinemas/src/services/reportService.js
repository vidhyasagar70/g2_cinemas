import { bookingService } from "./bookingService";
import { canteenService } from "./canteenService";

export const reportService = {
  getOverviewMetrics: () => {
    const bookings = bookingService.getBookings();
    const orders = canteenService.getOrders();

    const confirmedBookings = bookings.filter((b) => b.bookingStatus === "CONFIRMED");

    let ticketRevenue = 0;
    let ticketsSold = 0;
    let onlineRevenue = 0;
    let posRevenue = 0;

    confirmedBookings.forEach((b) => {
      ticketRevenue += b.ticketAmount;
      ticketsSold += b.ticketCount;
      if (b.source === "ONLINE") {
        onlineRevenue += b.ticketAmount + (b.convenienceFee || 0);
      } else {
        posRevenue += b.ticketAmount;
      }
    });

    let canteenRevenue = 0;
    orders.forEach((o) => {
      canteenRevenue += o.totalAmount;
    });

    const pendingOrders = orders.filter(
      (o) => o.status === "NEW" || o.status === "PREPARING"
    ).length;

    return {
      ticketRevenue,
      ticketsSold,
      canteenRevenue,
      totalRevenue: ticketRevenue + canteenRevenue,
      pendingOrders,
      onlineRevenue,
      posRevenue,
      totalBookingsCount: confirmedBookings.length
    };
  },

  getRevenueChartData: (range = "week") => {
    // Generate realistic daily breakdown for Recharts
    if (range === "today") {
      return [
        { time: "10 AM", online: 1200, pos: 1900, canteen: 950 },
        { time: "12 PM", online: 2400, pos: 3100, canteen: 1800 },
        { time: "02 PM", online: 3800, pos: 4200, canteen: 2450 },
        { time: "04 PM", online: 5100, pos: 3800, canteen: 3100 },
        { time: "06 PM", online: 8200, pos: 6400, canteen: 4800 },
        { time: "08 PM", online: 9500, pos: 7100, canteen: 5600 },
        { time: "10 PM", online: 6100, pos: 4500, canteen: 3200 }
      ];
    } else if (range === "month") {
      return [
        { name: "Week 1", online: 45000, pos: 38000, canteen: 26000 },
        { name: "Week 2", online: 52000, pos: 41000, canteen: 31000 },
        { name: "Week 3", online: 68000, pos: 49000, canteen: 39000 },
        { name: "Week 4", online: 74000, pos: 53000, canteen: 44000 }
      ];
    }

    // Default: This Week (Mon-Sun)
    return [
      { name: "Mon", online: 12400, pos: 9800, canteen: 6400 },
      { name: "Tue", online: 14200, pos: 10500, canteen: 7100 },
      { name: "Wed", online: 13800, pos: 11200, canteen: 6900 },
      { name: "Thu", online: 18500, pos: 13900, canteen: 8900 },
      { name: "Fri", online: 28400, pos: 22100, canteen: 14500 },
      { name: "Sat", online: 38900, pos: 31200, canteen: 21400 },
      { name: "Sun", online: 34500, pos: 28700, canteen: 19800 }
    ];
  },

  getPaymentMethodBreakdown: () => {
    const bookings = bookingService.getBookings();
    const breakdown = {
      UPI: 0,
      CARD: 0,
      CASH: 0,
      WALLET: 0
    };

    bookings.forEach((b) => {
      const method = b.paymentMethod || "UPI";
      if (breakdown[method] !== undefined) {
        breakdown[method] += b.totalAmount;
      } else {
        breakdown.UPI += b.totalAmount;
      }
    });

    return [
      { name: "UPI", value: breakdown.UPI, fill: "#FFC914" },
      { name: "Card", value: breakdown.CARD, fill: "#3B82F6" },
      { name: "Cash", value: breakdown.CASH, fill: "#22C55E" },
      { name: "Wallet", value: breakdown.WALLET, fill: "#A855F7" }
    ];
  },

  getMoviePerformance: () => {
    const bookings = bookingService.getBookings();
    const movieMap = {};

    bookings.forEach((b) => {
      if (!movieMap[b.movieTitle]) {
        movieMap[b.movieTitle] = {
          title: b.movieTitle,
          tickets: 0,
          revenue: 0,
          poster: b.moviePoster
        };
      }
      movieMap[b.movieTitle].tickets += b.ticketCount;
      movieMap[b.movieTitle].revenue += b.ticketAmount;
    });

    return Object.values(movieMap);
  },

  getScreenOccupancy: () => {
    return [
      {
        screen: "Screen 1 - IMAX Laser",
        totalSeats: 84,
        soldSeats: 58,
        blockedSeats: 2,
        availableSeats: 24,
        occupancyRate: 69,
        nextShow: "Mookuthi Amman 2: Mahasakthi (06:30 PM)"
      },
      {
        screen: "Screen 2 - Dolby Atmos",
        totalSeats: 84,
        soldSeats: 42,
        blockedSeats: 1,
        availableSeats: 41,
        occupancyRate: 50,
        nextShow: "SCENE (07:15 PM)"
      },
      {
        screen: "Screen 3 - Gold Lounge",
        totalSeats: 60,
        soldSeats: 38,
        blockedSeats: 0,
        availableSeats: 22,
        occupancyRate: 63,
        nextShow: "Ramayana: Rise of a Legend – Part 1 (06:00 PM)"
      }
    ];
  }
};

