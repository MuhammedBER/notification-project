import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { useAuth } from '../context/AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef(null);

    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        if (!user || !token) {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
            setNotifications([]);
            setStompClient(null);
            return;
        }

        // Fetch historical notifications
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/notifications/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setNotifications(data))
            .catch(err => console.error("Failed to fetch history", err));

        // Setup WebSocket client
        const client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/ws-notifications`),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                setIsConnected(true);

                // Subscribe to public topic
                client.subscribe('/topic/public', (message) => {
                    if (message.body) {
                        const newNotification = JSON.parse(message.body);
                        setNotifications(prev => [newNotification, ...prev]);
                    }
                });

                // Subscribe to private user topic
                client.subscribe(`/topic/user.${user.username}`, (message) => {
                    if (message.body) {
                        const newNotification = JSON.parse(message.body);
                        setNotifications(prev => [newNotification, ...prev]);
                    }
                });

                setStompClient(client);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
            },
            onDisconnect: () => {
                setIsConnected(false);
                setStompClient(null);
            }
        });

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [user, token]);

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, isConnected, dismissNotification, stompClient }}>
            {children}
        </NotificationContext.Provider>
    );
};
