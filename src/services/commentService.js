import axios from 'axios';
import { api } from './index'

export const updateCommentLike = async (commentId, type) => {
    try {
        const response = await api.post(`${process.env.REACT_APP_API}/comments/${commentId}/like`, {
            type
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update comment like:', error);
        throw error;
    }
};

export const deleteCommentLike = async (commentId) => {
    try {
        const response = await api.delete(`${process.env.REACT_APP_API}/comments/${commentId}/like`);
        return response.data;
    } catch (error) {
        console.error('Failed to update comment like:', error);
        throw error;
    }
};
