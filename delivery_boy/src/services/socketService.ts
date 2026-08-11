// @ts-ignore
import io from 'socket.io-client/dist/socket.io.js';
import { BACKEND_BASE_URL } from '../config/backendConfig';

export interface LocationPayload {
  orderId?: string;
  deliveryBoyId?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
}

let socket: any = null;
let currentJoinedRoom: string | null = null;
const connectionListeners: Array<(connected: boolean) => void> = [];
const locationListeners: Array<(data: LocationPayload) => void> = [];

/**
 * Initialize and return active Socket.IO connection
 */
export function getSocket(): any {
  if (!socket) {
    const serverUrl = BACKEND_BASE_URL || 'http://localhost:45000';
    console.log('[SOCKET] Connecting to backend server:', serverUrl);

    socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      timeout: 10000,
    });

    socket.on('connect', () => {
      console.log('[SOCKET] Connected with ID:', socket?.id);
      connectionListeners.forEach(cb => cb(true));

      // Re-join active room on reconnection
      if (currentJoinedRoom) {
        socket?.emit('join:order', { orderId: currentJoinedRoom, role: 'delivery_boy' });
      }
    });

    socket.on('disconnect', (reason: string) => {
      console.log('[SOCKET] Disconnected:', reason);
      connectionListeners.forEach(cb => cb(false));
    });

    socket.on('connect_error', (err: any) => {
      console.warn('[SOCKET] Connection error:', err?.message || err);
      connectionListeners.forEach(cb => cb(false));
    });


    socket.on('delivery:location:update', (data: LocationPayload) => {
      locationListeners.forEach(cb => cb(data));
    });
  }

  return socket;
}

/**
 * Join specific order tracking room
 */
export function joinOrderRoom(orderId: string, role = 'delivery_boy') {
  if (!orderId) return;
  currentJoinedRoom = orderId;
  const s = getSocket();
  if (s.connected) {
    s.emit('join:order', { orderId, role });
    console.log(`[SOCKET] Joined room order:${orderId}`);
  }
}

/**
 * Leave order tracking room
 */
export function leaveOrderRoom(orderId: string) {
  if (!orderId) return;
  if (currentJoinedRoom === orderId) {
    currentJoinedRoom = null;
  }
  const s = getSocket();
  if (s.connected) {
    s.emit('leave:order', { orderId });
  }
}

/**
 * Stream Delivery Boy real-time GPS location fix to Socket.IO backend
 */
export function emitDeliveryLocation(payload: LocationPayload) {
  const s = getSocket();
  if (s.connected) {
    s.emit('delivery:location', payload);
  }
}

/**
 * Subscribe to socket connection status changes
 */
export function subscribeConnectionStatus(callback: (connected: boolean) => void) {
  connectionListeners.push(callback);
  if (socket) {
    callback(socket.connected);
  }
  return () => {
    const idx = connectionListeners.indexOf(callback);
    if (idx !== -1) connectionListeners.splice(idx, 1);
  };
}

/**
 * Subscribe to live location broadcast updates
 */
export function subscribeLocationUpdates(callback: (data: LocationPayload) => void) {
  locationListeners.push(callback);
  return () => {
    const idx = locationListeners.indexOf(callback);
    if (idx !== -1) locationListeners.splice(idx, 1);
  };
}

/**
 * Disconnect socket cleanly
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentJoinedRoom = null;
  }
}
