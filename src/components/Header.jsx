// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';

function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 bg-blue-500 text-white py-3 px-4 z-10 shadow-md">
            <nav className="flex items-center">
                {/* Заголовок */}
                <h1 className="text-2xl font-bold">
                    <Link to="/">My Forum</Link>
                </h1>

                {/* Поисковая строка */}
                <div className="mx-auto w-full max-w-md px-4">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full px-4 py-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>

                {/* Кнопка и дропдаун */}
                <div className="ml-auto flex items-center gap-4">
                    <Link 
                        to="/new-post" 
                        className="bg-slate-100 text-blue-500 px-4 py-2 rounded hover:bg-blue-100 transition"
                    >
                        Add post
                    </Link>
                    <UserDropdown />
                </div>
            </nav>
        </header>
    );
}

export default Header;
