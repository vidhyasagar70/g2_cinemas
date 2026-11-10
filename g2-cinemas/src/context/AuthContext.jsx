import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

const ACTIVE_USER_STORAGE_KEY = "g2_cinemas_active_user";
const REGISTERED_CUSTOMERS_KEY = "g2_cinemas_registered_customers";

// Unified Demo Accounts for all 4 roles
export const ALL_DEMO_ACCOUNTS = [
  {
    role: "CUSTOMER",
    roleName: "Customer Portal",
    displayName: "Aarav Kumar (Customer)",
    email: "customer@g2cinemas.com",
    secondaryEmail: "aarav.kumar@gmail.com",
    phone: "9876543210",
    password: "G2Customer@2026",
    name: "Aarav Kumar",
    membership: "Gold VIP Member",
    portalPath: "/",
    portalName: "Customer Portal",
    badge: "VIP Customer",
    description: "Browse movies, book tickets, and order gourmet snacks."
  },
  {
    role: "COUNTER_POS",
    roleName: "Counter POS",
    displayName: "Counter POS Staff",
    email: "counterpos@g2cinemas.com",
    password: "G2Counter@2026",
    name: "Counter POS Staff",
    counter: "Counter #02",
    portalPath: "/pos",
    portalName: "Counter POS Terminal",
    badge: "Box Office",
    description: "Walk-in express ticketing, cash/card collection, and box office."
  },
  {
    role: "CANTEEN_STAFF",
    roleName: "Canteen Staff",
    displayName: "Canteen Kitchen Staff",
    email: "canteenstaff@g2cinemas.com",
    password: "G2Canteen@2026",
    name: "Canteen Staff",
    station: "Main Kitchen & Express Dispense",
    portalPath: "/canteen",
    portalName: "Canteen Kitchen",
    badge: "Kitchen Display",
    description: "Live snack preparation, order queue, and food dispatch."
  },
  {
    role: "THEATRE_ADMIN",
    roleName: "Theatre Admin",
    displayName: "Theatre Administrator",
    email: "theatreadmin@g2cinemas.com",
    password: "G2Admin@2026",
    name: "Theatre Admin",
    roleTitle: "Cinema Operations Manager",
    portalPath: "/admin",
    portalName: "Admin Dashboard",
    badge: "Full Control",
    description: "Full cinema management, showtimes, revenues, and reports."
  }
];

export const DEMO_CUSTOMER_ACCOUNT = ALL_DEMO_ACCOUNTS[0];
export const DEMO_STAFF_ACCOUNTS = ALL_DEMO_ACCOUNTS.filter((a) => a.role !== "CUSTOMER");

export const AuthProvider = ({ children }) => {
  // Unified User Session
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(user);
  const role = user?.role || null;
  const isCustomer = user?.role === "CUSTOMER";
  const isStaff = isAuthenticated && !isCustomer;

  // Single common login for all roles
  const login = (identifier, password) => {
    const cleanId = (identifier || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: "Please enter your email/phone and password." };
    }

    // 1. Check against predefined demo accounts (Customer, POS, Canteen, Admin)
    const matchedDemo = ALL_DEMO_ACCOUNTS.find((acc) => {
      const emailMatches =
        acc.email.toLowerCase() === cleanId ||
        (acc.secondaryEmail && acc.secondaryEmail.toLowerCase() === cleanId);
      const phoneMatches = acc.phone && acc.phone === cleanId;
      const passwordMatches =
        acc.password === cleanPass || cleanPass === "demo123" || cleanPass === "G2Admin@2026";

      return (emailMatches || phoneMatches) && passwordMatches;
    });

    if (matchedDemo) {
      const sessionUser = {
        role: matchedDemo.role,
        roleName: matchedDemo.roleName,
        displayName: matchedDemo.displayName,
        email: matchedDemo.email,
        phone: matchedDemo.phone || "",
        name: matchedDemo.name,
        membership: matchedDemo.membership || null,
        counter: matchedDemo.counter || null,
        station: matchedDemo.station || null,
        portalPath: matchedDemo.portalPath,
        portalName: matchedDemo.portalName,
        badge: matchedDemo.badge
      };

      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);

      toast.success(`Welcome to G2 Cinemas, ${sessionUser.name}!`);
      return {
        success: true,
        user: sessionUser,
        redirectPath: sessionUser.portalPath
      };
    }

    // 2. Check locally registered customers
    try {
      const registeredStr = localStorage.getItem(REGISTERED_CUSTOMERS_KEY);
      const registered = registeredStr ? JSON.parse(registeredStr) : [];
      const found = registered.find(
        (u) =>
          (u.email?.toLowerCase() === cleanId || u.phone === cleanId) &&
          u.password === cleanPass
      );

      if (found) {
        const sessionUser = {
          role: "CUSTOMER",
          roleName: "Customer Portal",
          displayName: `${found.name} (Customer)`,
          email: found.email,
          phone: found.phone,
          name: found.name,
          membership: found.membership || "G2 Club Member",
          portalPath: "/",
          portalName: "Customer Portal",
          badge: "Member"
        };

        localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);

        toast.success(`Welcome back, ${sessionUser.name}!`);
        return {
          success: true,
          user: sessionUser,
          redirectPath: "/"
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      success: false,
      error: "Invalid email/phone or password. Please select a demo account or register."
    };
  };

  // Register a new customer
  const register = ({ name, email, phone, password }) => {
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPhone = (phone || "").trim();
    const cleanPassword = (password || "").trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanPassword) {
      return { success: false, error: "Please fill in all registration fields." };
    }

    try {
      const registeredStr = localStorage.getItem(REGISTERED_CUSTOMERS_KEY);
      const registered = registeredStr ? JSON.parse(registeredStr) : [];

      // Check if email or phone already exists
      const existing = registered.find(
        (u) => u.email?.toLowerCase() === cleanEmail || u.phone === cleanPhone
      );
      const demoEmailMatch = ALL_DEMO_ACCOUNTS.some(
        (d) => d.email.toLowerCase() === cleanEmail
      );

      if (existing || demoEmailMatch) {
        return {
          success: false,
          error: "An account with this email or mobile number already exists. Please sign in."
        };
      }

      const newUser = {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password: cleanPassword,
        membership: "G2 Club Member",
        createdAt: new Date().toISOString()
      };

      registered.push(newUser);
      localStorage.setItem(REGISTERED_CUSTOMERS_KEY, JSON.stringify(registered));

      // Auto sign in as customer
      const sessionUser = {
        role: "CUSTOMER",
        roleName: "Customer Portal",
        displayName: `${newUser.name} (Customer)`,
        email: newUser.email,
        phone: newUser.phone,
        name: newUser.name,
        membership: newUser.membership,
        portalPath: "/",
        portalName: "Customer Portal",
        badge: "Member"
      };

      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);

      toast.success(`Account registered! Welcome to G2 Cinemas, ${cleanName}.`);
      return { success: true, user: sessionUser, redirectPath: "/" };
    } catch (e) {
      console.error(e);
      return { success: false, error: "Registration failed. Please try again." };
    }
  };

  // Allow staff to seamlessly switch between operational portals
  const switchPortal = (targetRole) => {
    const targetAccount = ALL_DEMO_ACCOUNTS.find((a) => a.role === targetRole);
    if (!targetAccount) return null;

    const updatedUser = {
      role: targetAccount.role,
      roleName: targetAccount.roleName,
      displayName: targetAccount.displayName,
      email: targetAccount.email,
      phone: targetAccount.phone || "",
      name: targetAccount.name,
      membership: targetAccount.membership || null,
      counter: targetAccount.counter || null,
      station: targetAccount.station || null,
      portalPath: targetAccount.portalPath,
      portalName: targetAccount.portalName,
      badge: targetAccount.badge
    };

    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast.success(`Switched to G2 Cinemas ${targetAccount.roleName}.`);
    return targetAccount.portalPath;
  };

  const logout = () => {
    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    setUser(null);
    toast.success("Signed out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isCustomer,
        isStaff,
        customerUser: isCustomer ? user : null, // Backwards compatibility for customer views
        isCustomerAuthenticated: isCustomer,

        // Common actions
        login,
        register,
        customerLogin: login,
        customerRegister: register,
        customerLogout: logout,
        logout,
        switchPortal,
        switchRole: switchPortal, // Alias for staff switcher

        // Demo accounts
        allDemoAccounts: ALL_DEMO_ACCOUNTS,
        demoStaffAccounts: DEMO_STAFF_ACCOUNTS,
        demoCustomerAccount: DEMO_CUSTOMER_ACCOUNT
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
