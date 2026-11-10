import { INITIAL_PRODUCTS } from "../data/products";
import { INITIAL_ORDERS } from "../data/orders";

const PRODUCTS_KEY = "g2_cinemas_products";
const ORDERS_KEY = "g2_cinemas_orders";

export const canteenService = {
  // Products
  getProducts: () => {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts: (products) => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error("Error saving products to localStorage", e);
    }
  },

  getProductById: (id) => {
    const products = canteenService.getProducts();
    return products.find((p) => p.id === id);
  },

  addProduct: (productData) => {
    const products = canteenService.getProducts();
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      isAvailable: productData.isAvailable !== undefined ? productData.isAvailable : true,
      stock: Number(productData.stock) || 50
    };
    const updated = [newProduct, ...products];
    canteenService.saveProducts(updated);
    return newProduct;
  },

  updateProduct: (id, productData) => {
    const products = canteenService.getProducts();
    const updated = products.map((p) => (p.id === id ? { ...p, ...productData } : p));
    canteenService.saveProducts(updated);
    return updated.find((p) => p.id === id);
  },

  deleteProduct: (id) => {
    const products = canteenService.getProducts();
    const updated = products.filter((p) => p.id !== id);
    canteenService.saveProducts(updated);
    return updated;
  },

  toggleProductAvailability: (id) => {
    const products = canteenService.getProducts();
    const updated = products.map((p) =>
      p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
    );
    canteenService.saveProducts(updated);
    return updated.find((p) => p.id === id);
  },

  // Orders
  getOrders: () => {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders: (orders) => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Error saving orders to localStorage", e);
    }
  },

  createOrder: ({
    bookingId = null,
    customerName,
    customerMobile,
    orderType = "COUNTER_PICKUP",
    screen = "General Counter",
    seats = "-",
    items,
    instructions = ""
  }) => {
    const orders = canteenService.getOrders();
    const orderNum = Math.floor(2050 + Math.random() * 8000);
    const orderId = `F-${orderNum}`;

    const totalAmount = items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    const now = new Date();
    const newOrder = {
      id: orderId,
      bookingId,
      customerName,
      customerMobile,
      orderType,
      screen,
      seats,
      status: "NEW",
      items,
      totalAmount,
      instructions,
      orderTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: now.toISOString()
    };

    const updated = [newOrder, ...orders];
    canteenService.saveOrders(updated);
    return newOrder;
  },

  updateOrderStatus: (orderId, newStatus) => {
    const orders = canteenService.getOrders();
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    canteenService.saveOrders(updated);
    return updated.find((o) => o.id === orderId);
  }
};

