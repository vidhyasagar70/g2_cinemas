// Dynamic dates for today and upcoming days
export const getAvailableDates = () => {
  const dates = [];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    dates.push({
      dateStr,
      day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : daysOfWeek[d.getDay()],
      dateNum: d.getDate(),
      month: months[d.getMonth()],
      fullFormatted: `${daysOfWeek[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
    });
  }
  return dates;
};

const dates = getAvailableDates();
const todayStr = dates[0].dateStr;
const tomorrowStr = dates[1].dateStr;
const dayAfterStr = dates[2].dateStr;

export const INITIAL_SHOWS = [
  // ==========================================
  // MOVIE 1: Mookuthi Amman 2: Mahasakthi
  // ==========================================
  {
    id: "show-ma-1",
    movieId: "mov-mookuthi-amman-2",
    screenId: "screen-1",
    screenName: "Screen 1 - IMAX Laser",
    date: todayStr,
    time: "10:30 AM",
    format: "4K Laser - Tamil",
    language: "Tamil",
    status: "Sold Out",
    pricing: { Standard: 190, Premium: 290, Recliner: 420 },
    bookedSeats: [
      "A1","A2","A3","A4","A5","A6","A7","A8","A9","A10","A11","A12",
      "B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12",
      "C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12",
      "D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12",
      "E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12",
      "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12",
      "G1","G2","G3","G4","G5","G6","G7","G8","G9","G10","G11","G12"
    ],
    blockedSeats: []
  },
  {
    id: "show-ma-2",
    movieId: "mov-mookuthi-amman-2",
    screenId: "screen-1",
    screenName: "Screen 1 - IMAX Laser",
    date: todayStr,
    time: "02:15 PM",
    format: "4K Laser - Tamil",
    language: "Tamil",
    status: "Filling Fast",
    pricing: { Standard: 190, Premium: 290, Recliner: 420 },
    bookedSeats: ["C3", "C4", "C5", "D4", "D5", "D6", "D7", "E4", "E5", "E6", "E7", "F5", "F6", "G5", "G6", "G7", "G8"],
    blockedSeats: ["A1", "A12"]
  },
  {
    id: "show-ma-3",
    movieId: "mov-mookuthi-amman-2",
    screenId: "screen-2",
    screenName: "Screen 2 - Dolby Atmos",
    date: todayStr,
    time: "06:30 PM",
    format: "Dolby Atmos - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 190, Premium: 280, Recliner: 400 },
    bookedSeats: ["D5", "D6", "E5", "E6"],
    blockedSeats: ["A1", "A12"]
  },
  {
    id: "show-ma-4",
    movieId: "mov-mookuthi-amman-2",
    screenId: "screen-2",
    screenName: "Screen 2 - Dolby Atmos",
    date: todayStr,
    time: "10:10 PM",
    format: "Dolby Atmos - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 190, Premium: 280, Recliner: 400 },
    bookedSeats: ["G3", "G4", "F6", "F7"],
    blockedSeats: []
  },
  // Tomorrow
  {
    id: "show-ma-5",
    movieId: "mov-mookuthi-amman-2",
    screenId: "screen-1",
    screenName: "Screen 1 - IMAX Laser",
    date: tomorrowStr,
    time: "02:15 PM",
    format: "4K Laser - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 190, Premium: 290, Recliner: 420 },
    bookedSeats: ["D4", "D5"],
    blockedSeats: []
  },
  {
    id: "show-ma-6",
    movieId: "mov-mookuthi-amman-2",
    screenId: "screen-2",
    screenName: "Screen 2 - Dolby Atmos",
    date: tomorrowStr,
    time: "06:30 PM",
    format: "Dolby Atmos - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 190, Premium: 280, Recliner: 400 },
    bookedSeats: [],
    blockedSeats: []
  },

  // ==========================================
  // MOVIE 2: SCENE
  // ==========================================
  {
    id: "show-sc-1",
    movieId: "mov-scene",
    screenId: "screen-2",
    screenName: "Screen 2 - Dolby Atmos",
    date: todayStr,
    time: "11:00 AM",
    format: "Dolby Atmos 2D - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 170, Premium: 260, Recliner: 380 },
    bookedSeats: ["B4", "B5", "E6", "E7"],
    blockedSeats: ["A1"]
  },
  {
    id: "show-sc-2",
    movieId: "mov-scene",
    screenId: "screen-2",
    screenName: "Screen 2 - Dolby Atmos",
    date: todayStr,
    time: "03:45 PM",
    format: "Dolby Atmos 2D - Tamil",
    language: "Tamil",
    status: "Filling Fast",
    pricing: { Standard: 170, Premium: 260, Recliner: 380 },
    bookedSeats: ["C4", "C5", "C6", "D5", "D6", "D7", "E6", "E7", "F5", "F6"],
    blockedSeats: []
  },
  {
    id: "show-sc-3",
    movieId: "mov-scene",
    screenId: "screen-3",
    screenName: "Screen 3 - Gold Lounge",
    date: todayStr,
    time: "07:15 PM",
    format: "Gold VIP - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 350, Premium: 450, Recliner: 550 },
    bookedSeats: ["B2", "B3", "C4", "C5"],
    blockedSeats: []
  },
  {
    id: "show-sc-4",
    movieId: "mov-scene",
    screenId: "screen-2",
    screenName: "Screen 2 - Dolby Atmos",
    date: todayStr,
    time: "10:30 PM",
    format: "Dolby Atmos 2D - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 170, Premium: 260, Recliner: 380 },
    bookedSeats: ["E5", "E6"],
    blockedSeats: []
  },
  // Tomorrow
  {
    id: "show-sc-5",
    movieId: "mov-scene",
    screenId: "screen-2",
    screenName: "Screen 2 - Dolby Atmos",
    date: tomorrowStr,
    time: "03:45 PM",
    format: "Dolby Atmos 2D - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 170, Premium: 260, Recliner: 380 },
    bookedSeats: [],
    blockedSeats: []
  },
  {
    id: "show-sc-6",
    movieId: "mov-scene",
    screenId: "screen-3",
    screenName: "Screen 3 - Gold Lounge",
    date: tomorrowStr,
    time: "07:15 PM",
    format: "Gold VIP - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 350, Premium: 450, Recliner: 550 },
    bookedSeats: [],
    blockedSeats: []
  },

  // ==========================================
  // MOVIE 3: Ramayana: Rise of a Legend – Part 1
  // ==========================================
  {
    id: "show-ram-1",
    movieId: "mov-ramayana-part-1",
    screenId: "screen-1",
    screenName: "Screen 1 - IMAX Laser",
    date: todayStr,
    time: "09:30 AM",
    format: "IMAX 3D - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 220, Premium: 340, Recliner: 480 },
    bookedSeats: ["C6", "C7", "D6", "D7"],
    blockedSeats: []
  },
  {
    id: "show-ram-2",
    movieId: "mov-ramayana-part-1",
    screenId: "screen-1",
    screenName: "Screen 1 - IMAX Laser",
    date: todayStr,
    time: "01:45 PM",
    format: "IMAX 3D - Tamil",
    language: "Tamil",
    status: "Filling Fast",
    pricing: { Standard: 220, Premium: 340, Recliner: 480 },
    bookedSeats: ["C4", "C5", "C6", "C7", "D4", "D5", "D6", "D7", "E5", "E6", "F4", "F5", "G6", "G7"],
    blockedSeats: ["A1", "A12"]
  },
  {
    id: "show-ram-3",
    movieId: "mov-ramayana-part-1",
    screenId: "screen-1",
    screenName: "Screen 1 - IMAX Laser",
    date: todayStr,
    time: "06:00 PM",
    format: "IMAX 3D - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 240, Premium: 360, Recliner: 500 },
    bookedSeats: ["D5", "D6", "E6", "E7"],
    blockedSeats: ["A1", "A12"]
  },
  {
    id: "show-ram-4",
    movieId: "mov-ramayana-part-1",
    screenId: "screen-1",
    screenName: "Screen 1 - IMAX Laser",
    date: todayStr,
    time: "10:15 PM",
    format: "IMAX 3D - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 220, Premium: 340, Recliner: 480 },
    bookedSeats: ["G4", "G5"],
    blockedSeats: []
  },
  // Tomorrow
  {
    id: "show-ram-5",
    movieId: "mov-ramayana-part-1",
    screenId: "screen-1",
    screenName: "Screen 1 - IMAX Laser",
    date: tomorrowStr,
    time: "01:45 PM",
    format: "IMAX 3D - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 220, Premium: 340, Recliner: 480 },
    bookedSeats: [],
    blockedSeats: []
  },
  {
    id: "show-ram-6",
    movieId: "mov-ramayana-part-1",
    screenId: "screen-1",
    screenName: "Screen 1 - IMAX Laser",
    date: tomorrowStr,
    time: "06:00 PM",
    format: "IMAX 3D - Tamil",
    language: "Tamil",
    status: "Available",
    pricing: { Standard: 240, Premium: 360, Recliner: 500 },
    bookedSeats: [],
    blockedSeats: []
  }
];
