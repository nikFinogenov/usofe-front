// services/categoryService.js
// const API_URL = '';

export const fetchCategories = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API}/categories`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
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
