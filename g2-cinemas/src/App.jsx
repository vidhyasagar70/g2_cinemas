import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./context/AppContext";
import { BookingProvider } from "./context/BookingContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Layouts
import { CustomerLayout } from "./layouts/CustomerLayout";
import { POSLayout } from "./layouts/POSLayout";
import { CanteenLayout } from "./layouts/CanteenLayout";
import { AdminLayout } from "./layouts/AdminLayout";

// Customer Pages
import { HomePage } from "./pages/customer/HomePage";
import { MoviesPage } from "./pages/customer/MoviesPage";
import { MovieDetailsPage } from "./pages/customer/MovieDetailsPage";
import { SeatSelectionPage } from "./pages/customer/SeatSelectionPage";
import { FoodSelectionPage } from "./pages/customer/FoodSelectionPage";
import { DeliverySelectionPage } from "./pages/customer/DeliverySelectionPage";
import { CheckoutPage } from "./pages/customer/CheckoutPage";
import { ConfirmationPage } from "./pages/customer/ConfirmationPage";
import { FoodPage } from "./pages/customer/FoodPage";
import { MyBookingsPage } from "./pages/customer/MyBookingsPage";

// Auth Pages (Unified Common Login & Register)
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

// POS Pages
import { POSOverviewPage } from "./pages/pos/POSOverviewPage";
import { POSNewTicketPage } from "./pages/pos/POSNewTicketPage";
import { POSBookingsPage } from "./pages/pos/POSBookingsPage";
import { POSShowsPage } from "./pages/pos/POSShowsPage";
import { POSReportsPage } from "./pages/pos/POSReportsPage";
import { POSSettingsPage } from "./pages/pos/POSSettingsPage";

// Canteen Pages
import { CanteenDashboardPage } from "./pages/canteen/CanteenDashboardPage";
import { CanteenMenuPage } from "./pages/canteen/CanteenMenuPage";
import { CanteenReportsPage } from "./pages/canteen/CanteenReportsPage";

// Admin Pages
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminMoviesPage } from "./pages/admin/AdminMoviesPage";
import { AdminBookingsPage } from "./pages/admin/AdminBookingsPage";
import { AdminCanteenPage } from "./pages/admin/AdminCanteenPage";
import { AdminReportsPage } from "./pages/admin/AdminReportsPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BookingProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#171717",
                  color: "#FFFFFF",
                  border: "1px solid #292929",
                  borderRadius: "12px",
                  fontSize: "13px"
                },
                success: {
                  iconTheme: {
                    primary: "#FFC914",
                    secondary: "#000000"
                  }
                }
              }}
            />

            <Routes>
              {/* Customer Portal - Pure public customer experience */}
              <Route path="/" element={<CustomerLayout />}>
                <Route index element={<HomePage />} />
                <Route path="movies" element={<MoviesPage />} />
                <Route path="movie/:id" element={<MovieDetailsPage />} />
                <Route path="book/seats" element={<SeatSelectionPage />} />
                <Route path="book/food" element={<FoodSelectionPage />} />
                <Route path="book/delivery" element={<DeliverySelectionPage />} />
                <Route path="book/checkout" element={<CheckoutPage />} />
                <Route path="book/confirmation/:bookingId" element={<ConfirmationPage />} />
                <Route path="food" element={<FoodPage />} />
                <Route path="my-bookings" element={<MyBookingsPage />} />
              </Route>

              {/* Unified Common Authentication Gateway */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/staff-login" element={<Navigate to="/login" replace />} />

              {/* Counter POS - Protected */}
              <Route
                path="/pos"
                element={
                  <ProtectedRoute requiredRole="COUNTER_POS">
                    <POSLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<POSOverviewPage />} />
                <Route path="new-ticket" element={<POSNewTicketPage />} />
                <Route path="bookings" element={<POSBookingsPage />} />
                <Route path="shows" element={<POSShowsPage />} />
                <Route path="reports" element={<POSReportsPage />} />
                <Route path="settings" element={<POSSettingsPage />} />
              </Route>

              {/* Canteen Staff - Protected */}
              <Route
                path="/canteen"
                element={
                  <ProtectedRoute requiredRole="CANTEEN_STAFF">
                    <CanteenLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<CanteenDashboardPage />} />
                <Route path="menu" element={<CanteenMenuPage />} />
                <Route path="reports" element={<CanteenReportsPage />} />
              </Route>

              {/* Theatre Admin - Protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="THEATRE_ADMIN">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="movies" element={<AdminMoviesPage />} />
                <Route path="bookings" element={<AdminBookingsPage />} />
                <Route path="canteen" element={<AdminCanteenPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </AppProvider>
  );
}

