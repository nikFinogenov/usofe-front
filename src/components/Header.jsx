// src/components/Header.jsx

import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 bg-blue-500 text-white p-4 z-10 shadow-md">
            <nav className="flex justify-between">
                <h1 className="text-xl font-bold"><Link to="/">My Forum</Link></h1>
                <div>
                    <Link to="/login" className="mr-4 hover:underline">Login</Link>
                    <Link to="/register" className="hover:underline">Register</Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;
