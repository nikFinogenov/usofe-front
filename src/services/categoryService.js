// services/categoryService.js

// import axios from 'axios';
import { api } from './index'

export const fetchCategories = async (page = 1, pageSize = 10) => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API}/categories`,{
            params: { page, pageSize }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
    }
};

export const fetchPostsByCategoryId = async (categoryId, page = 1, pageSize = 10) => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API}/categories/${categoryId}/posts`, {
            params: { page, pageSize }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch posts for category ${categoryId}:`, error);
        throw error;
    }
};

export const fetchCategoriesTags = async() => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API}/categories/tags`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
    }
};

export const createCategory = async (title, description) => {
    try {
        const response = await api.post(`${process.env.REACT_APP_API}/categories`, {
            title,
            description,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create category:', error);
        throw error;
    }
};


export const deleteCategory = async (categoryId) => {
    try {
        const response = await api.delete(`${process.env.REACT_APP_API}/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete category:', error);
        throw error;
    }
};
export const updateCategory = async (categoryId, title, description) => {
    try {
        const response = await api.patch(`${process.env.REACT_APP_API}/categories/${categoryId}`, {
            title,
            description,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update category:', error);
        throw error;
    }
};

