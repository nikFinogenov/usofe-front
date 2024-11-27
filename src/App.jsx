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
import Profile from './pages/Profile';
import Settings from './pages/Settings'
import ForgotPassword from './pages/ForgotPassord';
import ConfirmResetPassword from './pages/ConfirmResetPassword';
import ConfirmEmail from './pages/ConfirmEmail'
import { AxiosInterceptor } from './services/index'
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';
import User from './pages/User'
import Favourites from './pages/Favourites';
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function AppContent() {
    const { isLoading } = useContext(AuthContext);
    const [notification] = useState(null);

    return (
        isLoading ? <LoadingSpinner /> : (
            <div className="app-content bg-gray-100">
                <ScrollToTop /> {/* Этот компонент прокручивает наверх при каждом изменении маршрута */}
                <div className="flex flex-col min-h-screen ">
                    <Header />
                    <div className="flex flex-grow">
                        <Sidebar />
                        <div className="flex-grow flex flex-col">
                            {notification && <Notification text={notification.text} type={notification.type} />}
                            <main className="flex-grow">
                                <Routes>
                                    <Route path="/" element={<Main />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/post/:id" element={<FullPost />} />
                                    <Route path="/posts" element={<Posts />} />
                                    <Route path="/new-post" element={<NewPost />}/>
                                    <Route path="/edit-post/:id" element={<EditPost />}/>
                                    <Route path="/categories" element={<Categories />} />
                                    <Route path="/categories/:id/posts" element={<Category />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/user/:id" element={<User />} />
                                    <Route path="/favourites" element={<Favourites />}/>
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/forgot-password" element={<ForgotPassword />} />
                                    <Route path="/confirm-reset/:token" element={<ConfirmResetPassword />} />
                                    <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
                                    <Route path='*' element={<Error />} />
                                </Routes>
                            </main>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        )
    );
}

function App() {

    useEffect(() => {
        const originalWarn = console.warn;
    
        console.error = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('cannot appear as a descendant of')) {
                return; // Игнорируем конкретное предупреждение
            }
            originalWarn(...args);
        };
    
        return () => {
            console.warn = originalWarn;
        };
    }, []);
    

    return (
        <AuthProvider>
            <NotifyProvider>
                <Router>
                    <AxiosInterceptor />    
                    <AppContent />
                </Router>
            </NotifyProvider>
        </AuthProvider>
    );
}

export default App;
