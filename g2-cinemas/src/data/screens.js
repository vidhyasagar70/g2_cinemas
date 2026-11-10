export const INITIAL_SCREENS = [
  {
    id: "screen-1",
    name: "Screen 1 - Dolby Atmos",
    type: "4K Laser Dolby Atmos",
    totalSeats: 84,
    rows: ["A", "B", "C", "D", "E", "F", "G"],
    seatsPerRow: 12,
    categories: [
      { name: "Recliner", rows: ["G"], price: 400 },
      { name: "Premium", rows: ["D", "E", "F"], price: 280 },
      { name: "Standard", rows: ["A", "B", "C"], price: 180 }
    ]
  },
  {
    id: "screen-2",
    name: "Screen 2 - Dolby Atmos",
    type: "4K Dual Projection Dolby Atmos",
    totalSeats: 84,
    rows: ["A", "B", "C", "D", "E", "F", "G"],
    seatsPerRow: 12,
    categories: [
      { name: "Recliner", rows: ["G"], price: 380 },
      { name: "Premium", rows: ["D", "E", "F"], price: 260 },
      { name: "Standard", rows: ["A", "B", "C"], price: 170 }
    ]
  }
];
