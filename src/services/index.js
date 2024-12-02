import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { NotifyContext } from "../context/NotifyContext";
import { AuthContext } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API;

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

const AxiosInterceptor = () => {
    const navigate = useNavigate();
    const showNotification = useContext(NotifyContext);
    const { logout, user } = useContext(AuthContext);

    const allowedGetPaths = ['/posts', '/tags', '/me', '/categories', '/search', '/user', '/confirm'];
    const allowedPostPaths = ['/me'];
    const allowedDeletePaths = user ? [`/users/${user?.id}/posts`, `/users/${user?.id}/comments`, `/users/${user.id}/`] : [];
    
    api.interceptors.request.use((config) => {
        console.log(config.method, config.url);

        if (user && !user.emailConfirmed) {
            let isAllowed = false;
    
            if (config.method.toLowerCase() === 'get') {
                isAllowed = allowedGetPaths.some(path => config.url.includes(path));
            } else if (config.method.toLowerCase() === 'post') {
                isAllowed = allowedPostPaths.some(path => config.url.includes(path));
            } 
            else if (config.method.toLowerCase() === 'delete') {
                isAllowed = allowedDeletePaths.some(path => config.url.includes(path));
            }
    
            if (!isAllowed) {
                const controller = new AbortController();
                config.signal = controller.signal;
    
                controller.abort();
                showNotification("Please confirm your email to perform this action.", "error");
    
                return config;
            }
        }
    
        if (user) config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    
        return config;
    });

    api.interceptors.response.use(
        (config) => {
            return config;
        },
        async (error) => {
            if (axios.isCancel(error)) {
                console.log("Request was canceled:", error.message);
                return;
            }
            if (error.response.status === 401) {
                logout();
                navigate("/login");
                showNotification("Please log in.", "error");
            }
            if (error.response.status === 403) {
                showNotification("Access denied. You do not have permission to perform this action.", "error");
            }
            throw error;
        }
    );

    return null;
};

export { api, AxiosInterceptor };
