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
    const { logout, user } = useContext(AuthContext); // Получаем пользователя из AuthContext

    const allowedGetPaths = ['/posts', '/tags', '/me', '/categories', '/search', '/user', '/confirm']; // Пути, разрешенные для GET
    const allowedPostPaths = ['/me']; // Пути, разрешенные для POST
    const allowedDeletePaths = user ? [`/users/${user?.id}/posts`, `/users/${user?.id}/comments`, `/users/${user.id}/`] : []; // Пути, разрешенные для POST
    
    api.interceptors.request.use((config) => {
        console.log(config.method, config.url); // Для отладки

        if (user && !user.emailConfirmed) {
            let isAllowed = false;
    
            // Проверяем доступные пути в зависимости от метода
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
                config.signal = controller.signal; // Привязываем сигнал отмены к запросу
    
                controller.abort();
                showNotification("Please confirm your email to perform this action.", "error");
    
                // Возвращаем конфигурацию с отмененным сигналом
                return config; // Запрос не выполнится из-за аборта
            }
        }
    
        // Добавляем токен авторизации
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
                return; // Ничего не делаем, запрос уже отменен
            }
            if (error.response.status === 401) {
                logout();
                navigate("/login");
                showNotification("Please log in again.", "error");
            }
            if (error.response.status === 403) {
                showNotification("Access denied. You do not have permission to perform this action.", "error");
            }
            throw error;
        }
    );

    return null; // Этот компонент ничего не рендерит, его задача — настроить интерцепторы
};

export { api, AxiosInterceptor };
