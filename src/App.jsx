// src/App.jsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import FullPost from './pages/FullPost';
import Error from './pages/Error';
import { AuthProvider } from './context/AuthContext';


function App() {
    return (
        <AuthProvider>
        <Router>
            <Header />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/post/:id" element={<FullPost />} />
                    <Route path='*' element={<Error />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    </AuthProvider>
    );
}

export default App;
