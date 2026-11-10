export const INITIAL_SCREENS = [
  {
    id: "screen-1",
    name: "Screen 1 - IMAX Laser",
    type: "IMAX 4K with Dolby 7.1",
    totalSeats: 84,
    rows: ["A", "B", "C", "D", "E", "F", "G"],
    seatsPerRow: 12,
    categories: [
      { name: "Recliner", rows: ["G"], price: 420 },
      { name: "Premium", rows: ["D", "E", "F"], price: 290 },
      { name: "Standard", rows: ["A", "B", "C"], price: 190 }
    ]
  },
  {
    id: "screen-2",
    name: "Screen 2 - Dolby Atmos",
    type: "4K Dual Projection & Atmos",
    totalSeats: 84,
    rows: ["A", "B", "C", "D", "E", "F", "G"],
    seatsPerRow: 12,
    categories: [
      { name: "Recliner", rows: ["G"], price: 380 },
      { name: "Premium", rows: ["D", "E", "F"], price: 260 },
      { name: "Standard", rows: ["A", "B", "C"], price: 170 }
    ]
  },
  {
    id: "screen-3",
    name: "Screen 3 - Gold Lounge",
    type: "Luxury Plush VIP",
    totalSeats: 60,
    rows: ["A", "B", "C", "D", "E"],
    seatsPerRow: 12,
    categories: [
      { name: "Recliner", rows: ["D", "E"], price: 550 },
      { name: "Premium", rows: ["A", "B", "C"], price: 450 }
    ]
  }
];

