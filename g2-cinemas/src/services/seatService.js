import { INITIAL_SCREENS } from "../data/screens";

export const seatService = {
  getScreens: () => {
    return INITIAL_SCREENS;
  },

  getScreenById: (screenId) => {
    return INITIAL_SCREENS.find((s) => s.id === screenId) || INITIAL_SCREENS[0];
  },

  getSeatCategoryAndPrice: (screen, rowLetter, basePricing = {}) => {
    const categoryDef = screen.categories.find((c) => c.rows.includes(rowLetter)) || {
      name: "Standard",
      price: 190
    };

    let price = categoryDef.price;
    if (basePricing && basePricing[categoryDef.name]) {
      price = basePricing[categoryDef.name];
    }

    return {
      category: categoryDef.name,
      price
    };
  },

  generateSeatGrid: (screen, show) => {
    const booked = new Set(show?.bookedSeats || []);
    const blocked = new Set(show?.blockedSeats || []);
    const rows = screen.rows;
    const seatsPerRow = screen.seatsPerRow;

    const grid = [];

    rows.forEach((rowLetter) => {
      const { category, price } = seatService.getSeatCategoryAndPrice(screen, rowLetter, show?.pricing);
      const rowSeats = [];

      for (let num = 1; num <= seatsPerRow; num++) {
        const seatId = `${rowLetter}${num}`;
        let status = "AVAILABLE";
        if (booked.has(seatId)) {
          status = "SOLD";
        } else if (blocked.has(seatId)) {
          status = "BLOCKED";
        }

        rowSeats.push({
          id: seatId,
          row: rowLetter,
          number: num,
          category,
          price,
          status
        });
      }

      grid.push({
        rowLetter,
        category,
        price,
        seats: rowSeats
      });
    });

    return grid;
  }
};

