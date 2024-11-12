// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { fetchUser, fetchCurrentUser, clearUser} from '../services/userService';

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
                console.error('Failed to load user:', error);
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
            return data.user;
        } catch (error) {
            console.error('Login failed:', error);
            return null;
        }
    };

    const logout = async () => {
        console.log("LOGGIN OUT");
        await clearUser();
        localStorage.removeItem('token');
        setUser(null);
    };

    const register = () => {

    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
