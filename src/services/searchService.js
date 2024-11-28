import { api } from './index'

export const search = async (query) => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API}/search`, {
            params: { q: query }, // Pass the entire query string as `q`
        });
        return response.data;
    } catch (error) {
        console.error('Search failed:', error);
        throw new Error('Failed to fetch search results');
    }
};