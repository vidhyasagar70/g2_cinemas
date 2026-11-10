import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const BookingContext = createContext();

const STORAGE_KEY = "g2_cinemas_current_booking";

export const BookingProvider = ({ children }) => {
  const { customerUser } = useAuth();

  // Load saved in-progress booking if available
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [foodCart, setFoodCart] = useState([]);
  const [deliveryOption, setDeliveryOption] = useState("SEAT_DELIVERY"); // "SEAT_DELIVERY" | "COUNTER_PICKUP"
  const [deliveryDetails, setDeliveryDetails] = useState({ instructions: "" });
  const [customerDetails, setCustomerDetails] = useState(() => ({
    name: customerUser?.name || "Aarav Kumar",
    mobile: customerUser?.phone || "9876543210",
    email: customerUser?.email || "customer@g2cinemas.com"
  }));

  // Update customerDetails when customerUser changes
  useEffect(() => {
    if (customerUser) {
      setCustomerDetails({
        name: customerUser.name,
        mobile: customerUser.phone,
        email: customerUser.email
      });
    }
  }, [customerUser]);
  const [activeStep, setActiveStep] = useState(1);

  // Seat hold countdown simulation (10 minutes = 600s)
  const [holdTimeRemaining, setHoldTimeRemaining] = useState(600);

  useEffect(() => {
    let timer;
    if (selectedSeats.length > 0 && holdTimeRemaining > 0) {
      timer = setInterval(() => {
        setHoldTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            toast.error("Seat hold expired! Please re-select your seats.");
            setSelectedSeats([]);
            return 600;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedSeats.length, holdTimeRemaining]);

  const selectMovie = (movie) => {
    setSelectedMovie(movie);
  };

  const selectShow = (show, date) => {
    setSelectedShow(show);
    setSelectedDate(date);
    setSelectedSeats([]);
    setHoldTimeRemaining(600);
  };

  const toggleSeat = (seat) => {
    if (seat.status === "SOLD" || seat.status === "BLOCKED") {
      toast.error(`Seat ${seat.id} is not available.`);
      return;
    }

    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);

    if (isAlreadySelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        toast.error("Maximum 6 seats allowed per booking!");
        return;
      }
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  const clearSeats = () => {
    setSelectedSeats([]);
  };

  // Cart operations
  const addToCart = (product) => {
    setFoodCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`Added ${product.name} to cart`);
  };

  const updateCartQty = (productId, delta) => {
    setFoodCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setFoodCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setFoodCart([]);
  };

  const resetBooking = () => {
    setSelectedSeats([]);
    setFoodCart([]);
    setDeliveryOption("SEAT_DELIVERY");
    setDeliveryDetails({ instructions: "" });
    setActiveStep(1);
    setHoldTimeRemaining(600);
  };

  // Pricing calculations
  const totalTicketPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const totalFoodPrice = foodCart.reduce((sum, f) => sum + f.price * f.quantity, 0);
  const convenienceFee = selectedSeats.length > 0 ? Math.round(totalTicketPrice * 0.05 + 20) : 0;
  const grandTotal = totalTicketPrice + totalFoodPrice + convenienceFee;

  return (
    <BookingContext.Provider
      value={{
        selectedMovie,
        selectedShow,
        selectedDate,
        selectedSeats,
        foodCart,
        deliveryOption,
        deliveryDetails,
        customerDetails,
        activeStep,
        holdTimeRemaining,
        // Calculations
        totalTicketPrice,
        totalFoodPrice,
        convenienceFee,
        grandTotal,
        // Methods
        selectMovie,
        selectShow,
        toggleSeat,
        clearSeats,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        setDeliveryOption,
        setDeliveryDetails,
        setCustomerDetails,
        setActiveStep,
        resetBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

