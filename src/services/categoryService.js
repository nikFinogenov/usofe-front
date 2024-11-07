// services/categoryService.js

import axios from 'axios';

export const fetchCategories = async (page = 1, pageSize = 10) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API}/categories`,{
            params: { page, pageSize }
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
    }
};

export const fetchPostsByCategoryId = async (categoryId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API}/categories/${categoryId}/posts`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch posts for category ${categoryId}:`, error);
        throw error;
    }
};
