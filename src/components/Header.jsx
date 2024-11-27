import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';

function Header() {
    const [searchText, setSearchText] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearch = () => {
        console.log('Searching for:', searchText);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        setShowSuggestions(value.trim().length > 0);
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-blue-500 text-white py-3 px-4 z-10 shadow-md">
            <nav className="flex items-center">
                {/* Заголовок */}
                <h1 className="text-2xl font-bold">
                    <Link to="/">My Forum</Link>
                </h1>

                {/* Поисковая строка */}
                <div className="mx-auto w-full max-w-md px-4 relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    {showSuggestions && (
                        <div className="absolute top-full left-0 w-full bg-white shadow-md rounded mt-2 z-10 p-4">
                            {/* Подсказки */}
                            <div className="flex justify-between text-gray-500">
                                <div className='text-sm pr-2'>                                
                                    <p><strong>@userTag</strong> — search for users by tag</p>
                                    <p><strong>u/c/p:name</strong> — search users/categories/posts</p>
                                    {/* <p><strong>c:name</strong> — search for categories</p>
                                    <p><strong>p:name</strong> — search for posts</p> */}
                                    </div>
                                {/* Кнопка поиска */}
                                <button
                                    onClick={handleSearch}
                                    className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    )}
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
