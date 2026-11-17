// Dynamic dates and rolling shows schedule for G2 Cinemas (Screens 1 & 2)

/**
 * Format Date to local YYYY-MM-DD (avoids UTC timezone shift bug)
 */
export const formatDateStr = (d = new Date()) => {
  const dateObj = d instanceof Date ? d : new Date(d);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Get rolling dates list for today and upcoming days (defaults to 7 days)
 */
export const getAvailableDates = (count = 7) => {
  const dates = [];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = formatDateStr(d);
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

/**
 * Format a YYYY-MM-DD date string into a user-friendly label (e.g. "Today, 17 Nov")
 */
export const formatShowDate = (dateStr) => {
  if (!dateStr) return "Today";
  try {
    const parts = String(dateStr).split("-");
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month - 1, day);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const todayStr = formatDateStr(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatDateStr(tomorrow);

    if (dateStr === todayStr) {
      return `Today, ${day} ${months[month - 1]}`;
    }
    if (dateStr === tomorrowStr) {
      return `Tomorrow, ${day} ${months[month - 1]}`;
    }
    return `${daysOfWeek[d.getDay()]}, ${day} ${months[month - 1]}`;
  } catch {
    return dateStr;
  }
};

/**
 * Generate 12 shows for a specific date across Screen 1 & Screen 2
 */
export const generateShowsForDate = (dateStr, dayIndex = 0) => {
  const isToday = dayIndex === 0;
  const isTomorrow = dayIndex === 1;

  return [
    // ==========================================
    // MOVIE 1: Mookuthi Amman 2: Mahasakthi
    // ==========================================
    {
      id: `show-ma-${dateStr}-1030am`,
      movieId: "mov-mookuthi-amman-2",
      screenId: "screen-1",
      screenName: "Screen 1 - Dolby Atmos",
      date: dateStr,
      time: "10:30 AM",
      format: "Dolby Atmos 2D - Tamil",
      language: "Tamil",
      status: isToday ? "Sold Out" : "Available",
      pricing: { Standard: 180, Premium: 280, Recliner: 400 },
      bookedSeats: isToday
        ? [
            "A1","A2","A3","A4","A5","A6","A7","A8","A9","A10","A11","A12",
            "B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12",
            "C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12",
            "D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12",
            "E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12",
            "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12",
            "G1","G2","G3","G4","G5","G6","G7","G8","G9","G10","G11","G12"
          ]
        : ["D5", "D6"],
      blockedSeats: []
    },
    {
      id: `show-ma-${dateStr}-0215pm`,
      movieId: "mov-mookuthi-amman-2",
      screenId: "screen-1",
      screenName: "Screen 1 - Dolby Atmos",
      date: dateStr,
      time: "02:15 PM",
      format: "Dolby Atmos 2D - Tamil",
      language: "Tamil",
      status: isToday ? "Filling Fast" : "Available",
      pricing: { Standard: 180, Premium: 280, Recliner: 400 },
      bookedSeats: isToday
        ? ["C3", "C4", "C5", "D4", "D5", "D6", "D7", "E4", "E5", "E6", "E7", "F5", "F6", "G5", "G6", "G7", "G8"]
        : ["D4", "D5"],
      blockedSeats: ["A1", "A12"]
    },
    {
      id: `show-ma-${dateStr}-0630pm`,
      movieId: "mov-mookuthi-amman-2",
      screenId: "screen-2",
      screenName: "Screen 2 - Dolby Atmos",
      date: dateStr,
      time: "06:30 PM",
      format: "Dolby Atmos 2D - Tamil",
      language: "Tamil",
      status: isTomorrow ? "Filling Fast" : "Available",
      pricing: { Standard: 170, Premium: 260, Recliner: 380 },
      bookedSeats: ["D5", "D6", "E5", "E6"],
      blockedSeats: ["A1", "A12"]
    },
    {
      id: `show-ma-${dateStr}-1010pm`,
      movieId: "mov-mookuthi-amman-2",
      screenId: "screen-2",
      screenName: "Screen 2 - Dolby Atmos",
      date: dateStr,
      time: "10:10 PM",
      format: "Dolby Atmos 2D - Tamil",
      language: "Tamil",
      status: "Available",
      pricing: { Standard: 170, Premium: 260, Recliner: 380 },
      bookedSeats: ["G3", "G4", "F6", "F7"],
      blockedSeats: []
    },

    // ==========================================
    // MOVIE 2: SCENE
    // ==========================================
    {
      id: `show-sc-${dateStr}-1100am`,
      movieId: "mov-scene",
      screenId: "screen-2",
      screenName: "Screen 2 - Dolby Atmos",
      date: dateStr,
      time: "11:00 AM",
      format: "Dolby Atmos 2D - Tamil",
      language: "Tamil",
      status: "Available",
      pricing: { Standard: 170, Premium: 260, Recliner: 380 },
      bookedSeats: ["B4", "B5", "E6", "E7"],
      blockedSeats: ["A1"]
    },
    {
      id: `show-sc-${dateStr}-0345pm`,
      movieId: "mov-scene",
      screenId: "screen-2",
      screenName: "Screen 2 - Dolby Atmos",
      date: dateStr,
      time: "03:45 PM",
      format: "Dolby Atmos 2D - Tamil",
      language: "Tamil",
      status: isToday ? "Filling Fast" : "Available",
      pricing: { Standard: 170, Premium: 260, Recliner: 380 },
      bookedSeats: isToday
        ? ["C4", "C5", "C6", "D5", "D6", "D7", "E6", "E7", "F5", "F6"]
        : ["D6", "D7"],
      blockedSeats: []
    },
    {
      id: `show-sc-${dateStr}-0715pm`,
      movieId: "mov-scene",
      screenId: "screen-1",
      screenName: "Screen 1 - Dolby Atmos",
      date: dateStr,
      time: "07:15 PM",
      format: "Dolby Atmos 2D - Tamil",
      language: "Tamil",
      status: "Available",
      pricing: { Standard: 180, Premium: 280, Recliner: 400 },
      bookedSeats: ["B2", "B3", "C4", "C5"],
      blockedSeats: []
    },
    {
      id: `show-sc-${dateStr}-1030pm`,
      movieId: "mov-scene",
      screenId: "screen-2",
      screenName: "Screen 2 - Dolby Atmos",
      date: dateStr,
      time: "10:30 PM",
      format: "Dolby Atmos 2D - Tamil",
      language: "Tamil",
      status: "Available",
      pricing: { Standard: 170, Premium: 260, Recliner: 380 },
      bookedSeats: ["E5", "E6"],
      blockedSeats: []
    },

    // ==========================================
    // MOVIE 3: Ramayana: Rise of a Legend – Part 1
    // ==========================================
    {
      id: `show-ram-${dateStr}-0930am`,
      movieId: "mov-ramayana-part-1",
      screenId: "screen-1",
      screenName: "Screen 1 - Dolby Atmos",
      date: dateStr,
      time: "09:30 AM",
      format: "Dolby Atmos 3D - Tamil",
      language: "Tamil",
      status: "Available",
      pricing: { Standard: 200, Premium: 300, Recliner: 440 },
      bookedSeats: ["C6", "C7", "D6", "D7"],
      blockedSeats: []
    },
    {
      id: `show-ram-${dateStr}-0145pm`,
      movieId: "mov-ramayana-part-1",
      screenId: "screen-1",
      screenName: "Screen 1 - Dolby Atmos",
      date: dateStr,
      time: "01:45 PM",
      format: "Dolby Atmos 3D - Tamil",
      language: "Tamil",
      status: isToday ? "Filling Fast" : "Available",
      pricing: { Standard: 200, Premium: 300, Recliner: 440 },
      bookedSeats: isToday
        ? ["C4", "C5", "C6", "C7", "D4", "D5", "D6", "D7", "E5", "E6", "F4", "F5", "G6", "G7"]
        : ["D4", "D5"],
      blockedSeats: ["A1", "A12"]
    },
    {
      id: `show-ram-${dateStr}-0600pm`,
      movieId: "mov-ramayana-part-1",
      screenId: "screen-1",
      screenName: "Screen 1 - Dolby Atmos",
      date: dateStr,
      time: "06:00 PM",
      format: "Dolby Atmos 3D - Tamil",
      language: "Tamil",
      status: "Available",
      pricing: { Standard: 200, Premium: 300, Recliner: 440 },
      bookedSeats: ["D5", "D6", "E6", "E7"],
      blockedSeats: ["A1", "A12"]
    },
    {
      id: `show-ram-${dateStr}-1015pm`,
      movieId: "mov-ramayana-part-1",
      screenId: "screen-1",
      screenName: "Screen 1 - Dolby Atmos",
      date: dateStr,
      time: "10:15 PM",
      format: "Dolby Atmos 3D - Tamil",
      language: "Tamil",
      status: "Available",
      pricing: { Standard: 200, Premium: 300, Recliner: 440 },
      bookedSeats: ["G4", "G5"],
      blockedSeats: []
    }
  ];
};

/**
 * Generate rolling shows across all available dates
 */
export const generateRollingShows = (count = 7) => {
  const dates = getAvailableDates(count);
  const shows = [];
  dates.forEach((d, index) => {
    shows.push(...generateShowsForDate(d.dateStr, index));
  });
  return shows;
};

/**
 * Ensure shows are active, valid, and aligned with the current rolling date window.
 * If shows are empty or dates have passed, regenerates the full rolling schedule.
 */
export const ensureActiveShows = (existingShows, count = 7) => {
  const availableDates = getAvailableDates(count);
  const todayStr = availableDates[0].dateStr;

  // Check if existing shows array contains any show for today's date
  const hasTodayShows =
    Array.isArray(existingShows) &&
    existingShows.some((s) => s.date === todayStr);

  if (!hasTodayShows) {
    // Shows have expired or are missing: regenerate full schedule
    return generateRollingShows(count);
  }

  // Ensure every upcoming day in the 7-day rolling window is scheduled
  const updated = [...existingShows];
  let modified = false;

  availableDates.forEach((d, index) => {
    const hasDateShows = updated.some((s) => s.date === d.dateStr);
    if (!hasDateShows) {
      const newShows = generateShowsForDate(d.dateStr, index);
      updated.push(...newShows);
      modified = true;
    }
  });

  // Filter out shows older than today to keep storage lean
  const validShows = updated.filter((s) => s.date >= todayStr);
  return validShows;
};

export const INITIAL_SHOWS = generateRollingShows(7);
