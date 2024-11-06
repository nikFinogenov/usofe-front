// src/components/Sidebar.jsx

import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <aside className="fixed top-1/3 left-0 w-12 bg-blue-600 text-white shadow-2xl flex flex-col items-center py-6 space-y-6 rounded-lg">
            <nav>
                <ul className="space-y-4 text-2xl relative">
                    <li className="group relative" title="Home">
                        <Link to="/" className="block p-2 hover:bg-blue-500 rounded-full text-center">🏠</Link>
                        <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded-md transition-opacity duration-300">
                            Home
                        </span>
                    </li>
                    <li className="group relative" title="Posts">
                        <Link to="/posts" className="block p-2 hover:bg-blue-500 rounded-full text-center">📝</Link>
                        <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded-md transition-opacity duration-300">
                            Posts
                        </span>
                    </li>
                    <li className="group relative" title="Users">
                        <Link to="/users" className="block p-2 hover:bg-blue-500 rounded-full text-center">👥</Link>
                        <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded-md transition-opacity duration-300">
                            Users
                        </span>
                    </li>
                    <li className="group relative" title="Categories">
                        <Link to="/categories" className="block p-2 hover:bg-blue-500 rounded-full text-center">📂</Link>
                        <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded-md transition-opacity duration-300">
                            Categories
                        </span>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
