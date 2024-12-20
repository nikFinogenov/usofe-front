
import { api } from './index'

export const fetchPosts = async (page = 1, pageSize = 10, sortBy = 'newest', order = 'desc', filter = 'all') => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API}/posts`, {
            params: { page, pageSize, sortBy, order, filter }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const fetchPostById = async (id) => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API}/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch post:', error);
        throw error;
    }
};

export const fetchPostComments = async (id, page = 1, pageSize = 10, sortBy = 'most', order = 'desc', filter = 'all') => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API}/posts/${id}/comments`, {
            params: { page, pageSize, sortBy, order, filter }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch post comments:', error);
        throw error;
    }
};

export const fetchRandomPost = async () => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API}/posts/random`);
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
export const updatePost = async(id, title, content, categories, status) => {
    try {
        
        const response = await api.patch(`${process.env.REACT_APP_API}/posts/${id}`, {
            title, content, categories, status
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

export const favouritePost = async(id) => {
    try {
        const response = await api.post(`${process.env.REACT_APP_API}/favourites/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to update post fav:', error);
        throw error;
    }
};

export const deleteFavouritePost = async(id) => {
    try {
        const response = await api.delete(`${process.env.REACT_APP_API}/favourites/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to update post fav:', error);
        throw error;
    }
};

export const fetchPostsByDate = async(date, page = 1, pageSize = 10) => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API}/date/${date}/posts`, {
            params: { page, pageSize }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch posts for date ${date}:`, error);
        throw error;
    }
};
