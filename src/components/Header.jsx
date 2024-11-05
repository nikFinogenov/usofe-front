import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-blue-500 text-white p-4 z-10 shadow-md">
            <nav className="flex items-center">
                {/* Кнопка бургер-меню */}
                <button 
                    onClick={toggleDropdown} 
                    className="mr-4 inline-flex items-center justify-center p-2 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                    aria-controls="dropdown-menu" 
                    aria-expanded={dropdownOpen}
                >
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold"><Link to="/">My Forum</Link></h1>
                <div className="ml-auto">
                    <Link to="/login" className="mr-4 hover:underline">Login</Link>
                    <Link to="/register" className="hover:underline">Register</Link>
                </div>
            </nav>

            {/* Выпадающее меню */}
            {dropdownOpen && (
                <div className="absolute top-16 left-4 w-48 bg-white text-gray-800 rounded-md shadow-lg z-20 transition-opacity duration-200 ease-in-out">
                    <ul className="flex flex-col font-medium mt-2">
                        <li>
                            <Link to="/posts" className="block py-2 px-4 hover:bg-blue-500 hover:text-white rounded-md transition duration-200">Posts</Link>
                        </li>
                        <li>
                            <Link to="/users" className="block py-2 px-4 hover:bg-blue-500 hover:text-white rounded-md transition duration-200">Users</Link>
                        </li>
                        <li>
                            <Link to="/categories" className="block py-2 px-4 hover:bg-blue-500 hover:text-white rounded-md transition duration-200">Categories</Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}

export default Header;
