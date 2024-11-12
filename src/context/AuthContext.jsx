// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { fetchUser, fetchCurrentUser, createUser } from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const currentUser = await fetchCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                }
            } catch (error) {
                // console.error('Failed to load user:', error);
            } finally {
                setIsLoading(false);
            }
        };
        initializeUser();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await fetchUser(email, password);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return data;
        } catch (error) {
            // console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const register = async (email, username, fullName, password) => {
        try {
            const data = await createUser(username, email, fullName, password); // Передаем все параметры
            // localStorage.setItem('token', data.token);
            // setUser(data.user);
            // console.log(data);
            return data.message;
        } catch (error) {
            // console.error('Registration failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
