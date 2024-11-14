// src/context/NotifyContext.jsx
import React, { createContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';

export const NotifyContext = createContext();

export function NotifyProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type) => {
        setNotification({ text: message, type });
        setTimeout(() => setNotification(null), 5000); // Убираем уведомление через 5 секунд
    }, []);

    return (
        <NotifyContext.Provider value={showNotification}>
            {children}
            {notification && (
                <Notification
                    text={notification.text}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </NotifyContext.Provider>
    );
}
