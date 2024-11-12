// src/services/userService.js

import axios from 'axios';

export const fetchUser = async (email, password) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API}/auth/login`, {
            email, password
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await axios.post(`${process.env.REACT_APP_API}/auth/me`, { token });
    return response.data.user;
};

export const createUser = async (id) => {
    // try {
    //     const response = await axios.post(`${process.env.REACT_APP_API}/posts/${id}`);
    //     return response.data;
    // } catch (error) {
    //     console.error('Failed to fetch post:', error);
    //     throw error;
    // }
};

// src/services/userService.js
export const updateUserProfile = async (updatedData) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_API}/auth/updateProfile`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Failed to update profile:', error);
        throw error;
    }
};


