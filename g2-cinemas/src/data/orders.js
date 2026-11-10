export const INITIAL_ORDERS = [
  {
    id: "F-2048",
    bookingId: "G2-82410",
    customerName: "Aarav Kumar",
    customerMobile: "+91 98765 43210",
    orderType: "SEAT_DELIVERY", // "SEAT_DELIVERY" | "COUNTER_PICKUP"
    screen: "Screen 1 - Dolby Atmos",
    seats: "D5, D6",
    status: "NEW", // "NEW" | "PREPARING" | "READY" | "DELIVERED" | "COLLECTED"
    items: [
      { id: "prod-1", name: "Classic Cheese Popcorn", quantity: 2, price: 180 },
      { id: "prod-4", name: "Chilled Cola (Large)", quantity: 2, price: 120 }
    ],
    totalAmount: 600,
    instructions: "Less salt on the popcorn, please.",
    orderTime: new Date(Date.now() - 8 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: "F-2047",
    bookingId: "G2-82409",
    customerName: "Priya Sharma",
    customerMobile: "+91 98451 12345",
    orderType: "COUNTER_PICKUP",
    screen: "Screen 2 - Dolby Atmos",
    seats: "E6, E7",
    status: "PREPARING",
    items: [
      { id: "prod-2", name: "Blockbuster Combo", quantity: 1, price: 399 },
      { id: "prod-3", name: "Smoky Paneer Burger", quantity: 1, price: 220 }
    ],
    totalAmount: 619,
    instructions: "Extra tissues and straws please.",
    orderTime: new Date(Date.now() - 25 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: "F-2046",
    bookingId: "G2-82407",
    customerName: "Vikram Malhotra",
    customerMobile: "+91 99200 88776",
    orderType: "SEAT_DELIVERY",
    screen: "Screen 1 - Dolby Atmos",
    seats: "D2, D3",
    status: "READY",
    items: [
      { id: "prod-11", name: "G2 Royal VIP Duo Tub Combo", quantity: 1, price: 549 }
    ],
    totalAmount: 549,
    instructions: "Deliver with wet wipes.",
    orderTime: new Date(Date.now() - 40 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
  },
  {
    id: "F-2045",
    bookingId: "G2-82402",
    customerName: "Neha Patel",
    customerMobile: "+91 98223 99881",
    orderType: "COUNTER_PICKUP",
    screen: "Screen 1 - Dolby Atmos",
    seats: "C4, C5",
    status: "COLLECTED",
    items: [
      { id: "prod-5", name: "Loaded Cheese & Salsa Nachos", quantity: 2, price: 180 },
      { id: "prod-10", name: "Cold Coffee with Vanilla Float", quantity: 2, price: 170 }
    ],
    totalAmount: 700,
    instructions: "Salsa on the side.",
    orderTime: new Date(Date.now() - 75 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString()
  },
  {
    id: "F-2044",
    bookingId: "G2-82398",
    customerName: "Karan Johar",
    customerMobile: "+91 98110 54321",
    orderType: "SEAT_DELIVERY",
    screen: "Screen 2 - Dolby Atmos",
    seats: "F5, F6",
    status: "DELIVERED",
    items: [
      { id: "prod-6", name: "Golden Caramel Popcorn", quantity: 1, price: 200 },
      { id: "prod-4", name: "Chilled Cola (Large)", quantity: 2, price: 120 }
    ],
    totalAmount: 440,
    instructions: "",
    orderTime: new Date(Date.now() - 110 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString()
  }
];
