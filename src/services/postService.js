// src/services/postService.js

import axios from 'axios';
import { api } from './index'

export const fetchPosts = async (page = 1, pageSize = 10) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API}/posts`, {
            params: { page, pageSize }
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
export const fetchRandomPost = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API}/posts/random`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch random post:', error);
        throw error;
    }
};

export const updatePostLike = async (postId, type) => {
    try {
        const response = await api.post(`${process.env.REACT_APP_API}/posts/${postId}/like`, {
            type
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update post like:', error);
        throw error;
    }
};

export const deletePostLike = async (postId) => {
    try {
        const response = await api.delete(`${process.env.REACT_APP_API}/posts/${postId}/like`);
        return response.data;
    } catch (error) {
        console.error('Failed to update post like:', error);
        throw error;
    }
};

export const createPost = async(title, content, categories) => {
    try {
        const response = await api.post(`${process.env.REACT_APP_API}/posts`, {
            title, content, categories
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create post:', error);
        throw error;
    }
};

export const deletePostById = async(id) => {
    try {
        const response = await api.delete(`${process.env.REACT_APP_API}/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to create post:', error);
        throw error;
    }
};

