import axios from 'axios';

const API_URL = process.env.REACT_APP_API;

// Existing functions

export const fetchUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchUserPosts = async (page = 1, pageSize = 5, id) => {
    try {
        const response = await axios.get(`${API_URL}/users/${id}/posts`, {
            params: { page, pageSize }
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

    const response = await axios.post(`${API_URL}/auth/me`, { token });
    return response.data.user;
};

export const createUser = async (login, email, fullName, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            login, email, fullName, password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// New functions

// Update user details
export const updateUser = async (userId, { login, email, fullName, password, role }) => {
    try {
        const token = localStorage.getItem('token'); // Получаем токен из localStorage
        const response = await axios.patch(`${API_URL}/users/${userId}`, {
            login, email, fullName, password, role
        }, {
            headers: {
                'Authorization': `Bearer ${token}` // Отправляем токен в заголовках
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Upload avatar
export const uploadAvatar = async (formData) => {
    try {
        const token = localStorage.getItem('token');
        if(!token) {
            throw new Error('No token found');
        }
        const response = await axios.patch(`${API_URL}/users/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};

// Delete user account
export const deleteAccount = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};

// Delete all posts by user
export const deleteAllPosts = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${userId}/posts`);
        return response.data;
    } catch (error) {
        console.error('Error deleting all posts:', error);
        throw error;
    }
};
