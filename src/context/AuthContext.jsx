// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { fetchUser, fetchCurrentUser } from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await fetchCurrentUser();
            if (currentUser) {
                setUser(currentUser); // Set the user if token is valid
            }
        };
        loadUser();
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

    const logout = () => {
        localStorage.removeItem('token'); // Remove token on logout
        setUser(null);
    };

    const register = (email, username, password) => {
        // Registration logic
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
