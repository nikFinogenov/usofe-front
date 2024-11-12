// src/App.jsx

import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import FullPost from './pages/FullPost';
import Error from './pages/Error';
import Category from './pages/Category';
import Categories from './pages/Categories';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { NotifyProvider } from './context/NotifyContext';
import Posts from './pages/Posts';
import LoadingSpinner from './components/LoadingSpinner';
import Notification from './components/Notification';
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function AppContent() {
    const { isLoading } = useContext(AuthContext);
    const [notification, setNotification] = useState(null);

    if (isLoading) {
        return <LoadingSpinner />; // Показываем спиннер, пока идет загрузка
    }
    const handleNotification = (message, type) => {
        setNotification({ text: message, type });
        setTimeout(() => setNotification(null), 5000);  // Убираем уведомление через 5 секунд
    };

    return (
        <div className="app-content">
            <ScrollToTop /> {/* Этот компонент прокручивает наверх при каждом изменении маршрута */}
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-grow">
                    <Sidebar />
                    <div className="flex-grow flex flex-col">
                        {notification && <Notification text={notification.text} type={notification.type} />}
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<Main />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register onNotification={handleNotification} />} />
                                <Route path="/post/:id" element={<FullPost />} />
                                <Route path="/posts" element={<Posts />} />
                                <Route path="/categories" element={<Categories />} />
                                <Route path="/categories/:category_id/posts" element={<Category />} />
                                <Route path='*' element={<Error />} />
                            </Routes>
                        </main>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}


function App() {
    return (
        <AuthProvider>
            <NotifyProvider>
                <Router>
                    <AppContent />
                </Router>
            </NotifyProvider>
        </AuthProvider>
    );
}

export default App;
