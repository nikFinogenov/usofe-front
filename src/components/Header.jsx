// import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
    // const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 bg-blue-500 text-white p-4 z-10 shadow-md">
            <nav className="flex items-center">
                <h1 className="text-2xl font-bold"><Link to="/">My Forum</Link></h1>
                <div className="ml-auto">
                    <Link to="/login" className="mr-4 hover:underline">Login</Link>
                    <Link to="/register" className="hover:underline">Register</Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;
