// src/services/postService.js

import axios from 'axios';

const API_URL = 'http://localhost:3306/api';

export const fetchPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/posts`);
        return response.data.posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const fetchPostById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch post:', error);
        throw error;
    }
};
