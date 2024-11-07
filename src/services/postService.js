// src/services/postService.js

import axios from 'axios';

// const API_URL = 'http://localhost:3306/api';

export const fetchPosts = async (page = 1) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API}/posts`, {
            params: { page }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const fetchPostById = async (id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API}/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch post:', error);
        throw error;
    }
};

export const fetchPostComments = async (id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API}/posts/${id}/comments`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch post:', error);
        throw error;
    }
};

