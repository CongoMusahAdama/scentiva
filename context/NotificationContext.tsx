"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import Swal from 'sweetalert2';

interface NotificationContextType {
  socket: Socket | null;
}

const NotificationContext = createContext<NotificationContextType>({ socket: null });

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";
  // Remove http/https and trailing slash for socket.io
  const socketUrl = API_URL.replace(/\/$/, "");

  useEffect(() => {
    if (!token) return;

    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      if (user?.role === 'ADMIN') {
        newSocket.emit('joinAdmin');
      } else if (user?.id) {
        newSocket.emit('joinUser', user.id);
      }
    });

    // Listen for new orders (Admin only)
    newSocket.on('newOrder', (data) => {
      if (user?.role === 'ADMIN') {
        Swal.fire({
          title: 'New Order Received!',
          text: `Order #${data.orderId} from ${data.customer} for GHS ${data.amount}`,
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
        
        // Play notification sound
        try {
          const audio = new Audio('/notifications/new_order.mp3');
          audio.play();
        } catch (e) {}
      }
    });

    // Listen for order updates (User or Admin)
    newSocket.on('orderUpdate', (data) => {
      Swal.fire({
        title: 'Order Updated',
        text: `Order #${data.orderId} status changed to ${data.status.toUpperCase()}`,
        icon: 'info',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, user, socketUrl]);

  return (
    <NotificationContext.Provider value={{ socket }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
