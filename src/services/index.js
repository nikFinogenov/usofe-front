import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { NotifyContext } from "../context/NotifyContext";
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API;

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

const AxiosInterceptor = () => {
    const navigate = useNavigate();
    const showNotification = useContext(NotifyContext);
    const { logout } = useContext(AuthContext);

    api.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        return config;
    });

    api.interceptors.response.use(
        (config) => {
            return config;
        },
        async (error) => {
            if (error.response.status === 401) {
                // localStorage.removeItem('token');
                logout();
                navigate('/login');
                showNotification('Session expired. Please log in again.', 'error');
            }
            if(error.response.status === 403) {

            }
            throw error;
        }
    );

    return null; // этот компонент ничего не рендерит, его задача — настроить интерцепторы
};

export { api, AxiosInterceptor };
