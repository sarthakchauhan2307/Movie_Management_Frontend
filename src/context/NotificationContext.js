import React, { createContext, useContext, useState, useEffect } from 'react';
import connection, { startConnection, receiveMessages, removeReceiveMessage } from '../services/signalRService';
import * as signalR from "@microsoft/signalr";

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Load persistents from localStorage
        const loadStoredNotifications = () => {
            try {
                const stored = localStorage.getItem('global_notifications');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const now = new Date().getTime();
                    // Keep only messages less than 24 hours old
                    const hours24 = 24 * 60 * 60 * 1000;
                    const validNotifications = parsed.filter(n => now - n.timestamp < hours24);
                    
                    if (validNotifications.length !== parsed.length) {
                         localStorage.setItem('global_notifications', JSON.stringify(validNotifications));
                    }
                    setNotifications(validNotifications);
                }
            } catch (err) {
                console.error('Error loading notifications from local storage:', err);
            }
        };

        loadStoredNotifications();

        // Connect to SignalR
        startConnection();

        // Listen for incoming messages
        const handleReceiveMessage = (sender, message) => {
             const newNotification = {
                 id: Date.now().toString() + Math.random().toString(), // Added random for true uniqueness
                 sender,
                 message,
                 timestamp: new Date().getTime(),
                 isRead: false
             };
             
             setNotifications(prev => {
                 // Prevent duplicates if by chance there are microsecond overlaps
                 if (prev.some(n => n.message === message && n.sender === sender && (new Date().getTime() - n.timestamp) < 1000)) {
                     return prev;
                 }
                 const updated = [newNotification, ...prev];
                 localStorage.setItem('global_notifications', JSON.stringify(updated));
                 return updated;
             });
        };

        receiveMessages(handleReceiveMessage);

        // Cleanup on unmount
        return () => {
             removeReceiveMessage(handleReceiveMessage);
        };
    }, []);

    const broadcastMessage = async (msg) => {
        try {
            if (connection.state === signalR.HubConnectionState.Disconnected) {
                await startConnection();
            }
            
            // If it's connecting, we could wait, but signalR handles this typically if awaited correctly or we check state again
            if (connection.state === signalR.HubConnectionState.Connected) {
                await connection.invoke("SendToEveryone", msg);
                return true;
            } else {
                 console.error(`SignalR state is ${connection.state}. Cannot broadcast.`);
                 return false;
            }
        } catch (err) {
            console.error("Error broadcasting message:", err);
            return false;
        }
    };

    const markAsRead = (id) => {
        setNotifications(prev => {
            const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
            localStorage.setItem('global_notifications', JSON.stringify(updated));
            return updated;
        });
    };

    const dismissNotification = (id) => {
         setNotifications(prev => {
            const updated = prev.filter(n => n.id !== id);
            localStorage.setItem('global_notifications', JSON.stringify(updated));
            return updated;
        });
    }

    const value = {
        notifications,
        broadcastMessage,
        markAsRead,
        dismissNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
