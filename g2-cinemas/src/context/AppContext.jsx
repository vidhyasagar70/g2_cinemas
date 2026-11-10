import React, { createContext, useContext, useState, useEffect } from "react";
import { movieService } from "../services/movieService";
import { canteenService } from "../services/canteenService";
import { bookingService } from "../services/bookingService";
import { INITIAL_SCREENS } from "../data/screens";
import { INITIAL_SETTINGS } from "../data/settings";
import toast from "react-hot-toast";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Global State
  const [movies, setMovies] = useState(() => movieService.getMovies());
  const [shows, setShows] = useState(() => movieService.getShows());
  const [products, setProducts] = useState(() => canteenService.getProducts());
  const [bookings, setBookings] = useState(() => bookingService.getBookings());
  const [orders, setOrders] = useState(() => canteenService.getOrders());
  const [screens] = useState(INITIAL_SCREENS);

  // Customer Session-Only Bookings & Orders
  // Starts EMPTY ([]) on every browser session/refresh so customer side shows clean empty state
  const [customerBookings, setCustomerBookings] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("g2_cinemas_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old cached location to Vadipatti, Tamil Nadu if found
        let needsSave = false;
        if (
          parsed?.cinema?.location?.includes("Koramangala") ||
          parsed?.cinema?.city !== "Vadipatti" ||
          (parsed?.cinema?.availableCities && parsed.cinema.availableCities.length > 1) ||
          parsed?.cinema?.screensCount !== 2
        ) {
          parsed.cinema = {
            ...parsed.cinema,
            location: "3X7J+P7, Chinnamanayakkanpatti, Vadipatti, Tamil Nadu 625218",
            city: "Vadipatti",
            availableCities: ["Vadipatti"],
            screensCount: 2,
            gstNumber: "33AABCU9603R1ZM"
          };
          needsSave = true;
        }

        // Migrate personal names to role-based titles
        if (
          parsed?.posStaff?.name === "Rajesh Kumar" ||
          parsed?.adminProfile?.name === "Maya Sharma" ||
          parsed?.canteenStaff?.name === "Sunil Verma"
        ) {
          parsed.posStaff = { ...INITIAL_SETTINGS.posStaff, ...parsed.posStaff, name: "Counter POS Staff" };
          parsed.canteenStaff = { ...INITIAL_SETTINGS.canteenStaff, ...parsed.canteenStaff, name: "Canteen Staff" };
          parsed.adminProfile = {
            ...INITIAL_SETTINGS.adminProfile,
            ...parsed.adminProfile,
            name: "Theatre Admin",
            role: "Theatre Administrator",
            email: "theatreadmin@g2cinemas.com"
          };
          needsSave = true;
        }

        if (needsSave) {
          localStorage.setItem("g2_cinemas_settings", JSON.stringify(parsed));
        }
        return parsed;
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [selectedLocation, setSelectedLocation] = useState(
    settings.cinema?.city && settings.cinema.city !== "Bengaluru" ? settings.cinema.city : "Vadipatti"
  );

  // Sync state changes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("g2_cinemas_settings", JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Movies Actions
  const handleAddMovie = (movieData) => {
    const newMovie = movieService.addMovie(movieData);
    setMovies(movieService.getMovies());
    toast.success(`Movie "${newMovie.title}" added successfully!`);
    return newMovie;
  };

  const handleUpdateMovie = (id, movieData) => {
    const updated = movieService.updateMovie(id, movieData);
    setMovies(movieService.getMovies());
    toast.success(`Movie "${updated.title}" updated.`);
    return updated;
  };

  const handleDeleteMovie = (id) => {
    const updated = movieService.deleteMovie(id);
    setMovies(updated);
    toast.success("Movie removed from schedule.");
  };

  // Shows Actions
  const handleAddShow = (showData) => {
    const newShow = movieService.addShow(showData);
    setShows(movieService.getShows());
    toast.success("New showtime added successfully!");
    return newShow;
  };

  const handleUpdateShow = (id, showData) => {
    const updated = movieService.updateShow(id, showData);
    setShows(movieService.getShows());
    toast.success("Showtime updated.");
    return updated;
  };

  const handleDeleteShow = (id) => {
    const updated = movieService.deleteShow(id);
    setShows(updated);
    toast.success("Showtime deleted.");
  };

  // Bookings Actions
  const handleCreateBooking = (bookingPayload) => {
    const newBooking = bookingService.createBooking(bookingPayload);
    setBookings(bookingService.getBookings());
    setShows(movieService.getShows()); // updated booked seats
    setOrders(canteenService.getOrders()); // updated if food order included

    // Update customer session bookings and snack orders
    setCustomerBookings((prev) => [newBooking, ...prev]);
    if (newBooking.foodOrder) {
      setCustomerOrders((prev) => [newBooking.foodOrder, ...prev]);
    }

    toast.success(`Booking Confirmed! ID: ${newBooking.id}`);
    return newBooking;
  };

  const handleCancelBooking = (bookingId) => {
    const updated = bookingService.cancelBooking(bookingId);
    setBookings(bookingService.getBookings());
    setShows(movieService.getShows());
    setCustomerBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: "CANCELLED" } : b))
    );
    toast.success(`Booking ${bookingId} has been cancelled.`);
    return updated;
  };

  // Canteen Products Actions
  const handleAddProduct = (productData) => {
    const newProd = canteenService.addProduct(productData);
    setProducts(canteenService.getProducts());
    toast.success(`Product "${newProd.name}" added to Canteen menu!`);
    return newProd;
  };

  const handleUpdateProduct = (id, productData) => {
    const updated = canteenService.updateProduct(id, productData);
    setProducts(canteenService.getProducts());
    toast.success(`Product "${updated.name}" updated.`);
    return updated;
  };

  const handleDeleteProduct = (id) => {
    const updated = canteenService.deleteProduct(id);
    setProducts(updated);
    toast.success("Product removed from Canteen menu.");
  };

  const handleToggleProductAvailability = (id) => {
    const updated = canteenService.toggleProductAvailability(id);
    setProducts(canteenService.getProducts());
    toast.success(
      `Product "${updated.name}" is now ${updated.isAvailable ? "Available" : "Disabled"}`
    );
  };

  // Canteen Orders Actions
  const handleCreateStandaloneOrder = (orderPayload) => {
    const newOrder = canteenService.createOrder(orderPayload);
    setOrders(canteenService.getOrders());
    setCustomerOrders((prev) => [newOrder, ...prev]);
    toast.success(`Order Placed! ID: ${newOrder.id}`);
    return newOrder;
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = canteenService.updateOrderStatus(orderId, newStatus);
    setOrders(canteenService.getOrders());
    setCustomerOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order #${orderId} moved to ${newStatus}`);
    return updated;
  };

  // Settings Actions
  const handleUpdateSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings
    }));
    toast.success("Settings saved successfully.");
  };

  // Reset to initial demo data
  const handleResetData = () => {
    localStorage.removeItem("g2_cinemas_movies");
    localStorage.removeItem("g2_cinemas_shows");
    localStorage.removeItem("g2_cinemas_products");
    localStorage.removeItem("g2_cinemas_bookings");
    localStorage.removeItem("g2_cinemas_orders");
    localStorage.removeItem("g2_cinemas_settings");
    localStorage.setItem("g2_cinemas_catalogue_version", "v3_tamilnadu_releases");

    setMovies(movieService.getMovies());
    setShows(movieService.getShows());
    setProducts(canteenService.getProducts());
    setBookings(bookingService.getBookings());
    setOrders(canteenService.getOrders());
    setCustomerBookings([]);
    setCustomerOrders([]);
    setSettings(INITIAL_SETTINGS);
    toast.success("Demo data reset to default successfully!");
  };

  return (
    <AppContext.Provider
      value={{
        movies,
        shows,
        products,
        bookings,
        orders,
        customerBookings,
        customerOrders,
        screens,
        settings,
        selectedLocation,
        setSelectedLocation,
        // Methods
        addMovie: handleAddMovie,
        updateMovie: handleUpdateMovie,
        deleteMovie: handleDeleteMovie,
        addShow: handleAddShow,
        updateShow: handleUpdateShow,
        deleteShow: handleDeleteShow,
        createBooking: handleCreateBooking,
        cancelBooking: handleCancelBooking,
        addProduct: handleAddProduct,
        updateProduct: handleUpdateProduct,
        deleteProduct: handleDeleteProduct,
        toggleProductAvailability: handleToggleProductAvailability,
        createStandaloneOrder: handleCreateStandaloneOrder,
        updateOrderStatus: handleUpdateOrderStatus,
        updateSettings: handleUpdateSettings,
        resetData: handleResetData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

