// src/components/Header.jsx

import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="bg-blue-500 text-white p-4">
            <nav className="flex justify-between">
                <h1 className="text-xl font-bold">My Forum</h1>
                <div>
                    <Link to="/login" className="mr-4 hover:underline">Login</Link>
                    <Link to="/register" className="hover:underline">Register</Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;
