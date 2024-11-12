// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
import UserDropdown from './UserDropdown';
// import ProfileMenu from './ProfileMenu';

function Header() {
    // const { user } = useContext(AuthContext);

    return (
        <header className="fixed top-0 left-0 right-0 bg-blue-500 text-white p-4 z-10 shadow-md">
            <nav className="flex items-center">
                <h1 className="text-2xl font-bold">
                    <Link to="/">My Forum</Link>
                </h1>
                <div className="ml-auto flex items-center">
                    <UserDropdown />
                </div>
            </nav>
        </header>
    );
}

export default Header;
