// src/context/AuthContext.jsx

import React, { createContext, useState } from 'react';

// Создаем контекст
export const AuthContext = createContext();

// Провайдер для оборачивания приложения
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        // Здесь должна быть логика аутентификации
        // Например, сделать запрос к вашему API
        // Если успешно, установить пользователя
        setUser({ email });
    };

    const register = (email, username, password) => {
        // Логика регистрации
        // После успешной регистрации можно выполнить вход
        setUser({ email, username });
    };

    const logout = () => {
        setUser(null); // Убираем пользователя при выходе
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
