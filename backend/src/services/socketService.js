const { Server } = require('socket.io');
const DeliveryBoy = require('../models/deliveryBoyModel');
const Order = require('../models/orderSchema');

let io = null;
const lastDbUpdateTimes = new Map(); // deliveryBoyId -> timestamp

/**
 * Initialize Socket.IO Server
 */
function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    },
    pingInterval: 10000,
    pingTimeout: 5000
  });

  io.on('connection', (socket) => {
    console.log(`[SOCKET] Client connected: ${socket.id}`);

    // Join order tracking room
    socket.on('join:order', ({ orderId, role }) => {
      if (orderId) {
        const roomName = `order:${orderId}`;
        socket.join(roomName);
        console.log(`[SOCKET] ${socket.id} joined room: ${roomName} (Role: ${role || 'subscriber'})`);
        socket.emit('joined:order', { orderId, success: true });
      }
    });

    // Leave order tracking room
    socket.on('leave:order', ({ orderId }) => {
      if (orderId) {
        const roomName = `order:${orderId}`;
        socket.leave(roomName);
        console.log(`[SOCKET] ${socket.id} left room: ${roomName}`);
      }
    });

    // Handle Delivery Boy Live Location Update
    socket.on('delivery:location', async (data) => {
      try {
        const { orderId, deliveryBoyId, latitude, longitude, accuracy, heading, speed, timestamp } = data || {};

        // Validation: Ensure valid GPS bounds
        const lat = Number(latitude);
        const lng = Number(longitude);

        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          console.warn('[SOCKET] Rejected invalid GPS coordinates:', data);
          return;
        }

        const updatePayload = {
          orderId: orderId || null,
          deliveryBoyId: deliveryBoyId || null,
          latitude: lat,
          longitude: lng,
          accuracy: Number(accuracy) || 0,
          heading: Number(heading) || 0,
          speed: Number(speed) || 0,
          timestamp: timestamp || Date.now()
        };

        // Broadcast real-time location immediately to order room
        if (orderId) {
          const roomName = `order:${orderId}`;
          io.to(roomName).emit('delivery:location:update', updatePayload);
        }

        // Also broadcast to global delivery tracking channel if needed
        io.emit('delivery:location:broadcast', updatePayload);

        // Throttled Database Update (Write to MongoDB at most once every 10 seconds per rider)
        const now = Date.now();
        const dBoyKey = deliveryBoyId || orderId || 'default';
        const lastUpdate = lastDbUpdateTimes.get(dBoyKey) || 0;

        if (now - lastUpdate >= 10000) {
          lastDbUpdateTimes.set(dBoyKey, now);
          saveLocationToDb(deliveryBoyId, orderId, lat, lng);
        }
      } catch (err) {
        console.error('[SOCKET] Error handling delivery:location event:', err.message);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`[SOCKET] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

/**
 * Save Location Update to MongoDB Database safely
 */
async function saveLocationToDb(deliveryBoyId, orderId, lat, lng) {
  try {
    let deliveryBoy = null;
    if (deliveryBoyId) {
      deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    }
    if (!deliveryBoy && orderId) {
      const order = await Order.findOne({ orderId });
      if (order && order.deliveryBoyId) {
        deliveryBoy = await DeliveryBoy.findById(order.deliveryBoyId);
      }
    }
    if (!deliveryBoy) {
      deliveryBoy = await DeliveryBoy.findOne({ status: 'active' });
    }

    if (deliveryBoy) {
      deliveryBoy.location = {
        latitude: lat,
        longitude: lng,
        address: deliveryBoy.location?.address || 'En route delivery',
        lastUpdated: new Date()
      };
      await deliveryBoy.save();
    }
  } catch (err) {
    console.error('[SOCKET] Failed to persist location to MongoDB:', err.message);
  }
}

/**
 * Get active Socket.IO server instance
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
}

module.exports = {
  initSocket,
  getIO
};
