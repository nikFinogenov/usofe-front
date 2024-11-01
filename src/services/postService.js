// src/services/postService.js

import axios from 'axios';

const API_URL = 'http://localhost:3306/api';

export async function fetchPosts() {
    try {
        const response = await axios.get(`${API_URL}/posts`);
        return response.data.posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}
