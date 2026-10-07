import { Server } from "socket.io";

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room handlers
    socket.on("join", (room) => {
      if (room) {
        socket.join(room);
        console.log(`[Socket.IO] ${socket.id} joined room: ${room}`);
      }
    });

    socket.on("leave", (room) => {
      if (room) {
        socket.leave(room);
        console.log(`[Socket.IO] ${socket.id} left room: ${room}`);
      }
    });

    // Real-time rider location relay
    socket.on("rider:send_location", (data) => {
      const { riderId, orderId, coordinates, heading, speed } = data || {};
      if (orderId) {
        io.to(`order:${orderId}`).emit("rider:location_update", {
          riderId,
          orderId,
          coordinates,
          heading,
          speed,
          timestamp: new Date().toISOString(),
        });
      }
      io.to("admin").emit("rider:location_update", {
        riderId,
        coordinates,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    console.warn("[Socket.IO] io instance accessed before initialization");
  }
  return io;
};

export const emitToOrder = (orderId, event, data) => {
  if (io && orderId) {
    io.to(`order:${orderId}`).emit(event, data);
  }
};

export const emitToUser = (userId, event, data) => {
  if (io && userId) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export const emitToRestaurant = (restaurantId, event, data) => {
  if (io && restaurantId) {
    io.to(`restaurant:${restaurantId}`).emit(event, data);
  }
};

export const emitToRider = (riderId, event, data) => {
  if (io && riderId) {
    io.to(`rider:${riderId}`).emit(event, data);
  }
};

export const emitToAdmin = (event, data) => {
  if (io) {
    io.to("admin").emit(event, data);
  }
};

export const broadcastEvent = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};
