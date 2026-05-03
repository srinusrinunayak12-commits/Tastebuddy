/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    }
  });

  const PORT = 3000;

  // Real-time Order Logic
  const activeOrders = new Map();
  const outOfStockItems = new Set();

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Initial sync of out-of-stock items
    socket.emit('inventory-sync', Array.from(outOfStockItems));

    // Customer places order
    socket.on("place-order", (orderData) => {
      if (outOfStockItems.has(orderData.dishName)) {
        socket.emit('order-error', { message: 'Item is currently out of stock!' });
        return;
      }

      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const order = {
        ...orderData,
        id: orderId,
        timestamp: Date.now(),
        status: 'PENDING_ACCEPTANCE'
      };

      activeOrders.set(orderId, order);
      console.log("Order placed:", orderId);
      
      io.emit("new-order", order);

      // Auto-cancel timer (120 seconds)
      setTimeout(() => {
        const currentOrder = activeOrders.get(orderId);
        if (currentOrder && currentOrder.status === 'PENDING_ACCEPTANCE') {
          currentOrder.status = 'CANCELLED';
          activeOrders.set(orderId, currentOrder);
          io.emit("order-status-changed", { orderId, status: 'CANCELLED', reason: 'Non-response from merchant' });
          console.log(`Order ${orderId} auto-cancelled due to timeout.`);
        }
      }, 120000); 
    });

    // Merchant updates inventory
    socket.on("toggle-inventory", ({ dishName, outOfStock }) => {
      if (outOfStock) outOfStockItems.add(dishName);
      else outOfStockItems.delete(dishName);
      io.emit('inventory-sync', Array.from(outOfStockItems));
    });

    // Merchant accepts/updates order
    socket.on("update-order-status", (data) => {
      const order = activeOrders.get(data.orderId);
      if (order) {
        order.status = data.status;
        activeOrders.set(data.orderId, order);
        io.emit("order-status-changed", data);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
