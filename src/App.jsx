// src/App.jsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import { AuthProvider } from './context/AuthContext';
import Posts from './pages/Posts';


function App() {
    return (
        <AuthProvider>
        <Router>
            <Header />
            <Sidebar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/post/:id" element={<FullPost />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/categories/:category_id/posts" element={<Category />} />
                    <Route path='*' element={<Error />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    </AuthProvider>
    );
}

export default App;
