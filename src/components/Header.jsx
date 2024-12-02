import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserDropdown from './UserDropdown';
import { fetchRandomPost } from '../services/postService';
import { AuthContext } from '../context/AuthContext';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosClose } from "react-icons/io";

function Header() {
    const [searchText, setSearchText] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);  // Состояние для открытия меню
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleSearch = async () => {
        try {
            if (!searchText.trim()) {
                console.log('Search text is empty');
                return;
            }

            navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
            setShowSuggestions(false);
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        setShowSuggestions(value.trim().length > 0);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
        }, 100);
    };
    const handleRandomClick = async () => {
        try {
            const { id } = await fetchRandomPost();
            // console.log(id);
            // if(id === null) setRandomId(1);// обновляем состояние, чтобы ссылка изменилась
            navigate(`/post/${id}`); // перенаправляем на новую страницу случайного поста
        } catch (error) {
            console.error('Failed to load random post:', error);
        }
    };

    const handleFocus = () => {
        setShowSuggestions(searchText.trim().length > 0);
    };

    const handleSearchButtonMouseDown = (e) => {
        e.preventDefault();  // Prevent the blur event from being triggered
    };

    const handleLabelClick = (e) => {
        setSearchText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-blue-500 text-white py-3 px-4 z-10 shadow-md">
            <nav className="flex items-center">
                {/* Бургер-меню на мобильных */}
                <button
                    className="block xl:hidden text-2xl"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <IoIosClose /> : <RxHamburgerMenu />}
                </button>

                {/* Заголовок */}
                <h1 className="text-2xl font-bold ml-4 sm:block hidden">
                    <Link to="/" onClick={handleLabelClick}>Muffin</Link>
                </h1>

                {/* Поисковая строка */}
                <div className="mx-auto w-full max-w-md px-4 relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onChange={handleInputChange}
                        onBlur={handleBlur}  // Close suggestions on blur
                        onFocus={handleFocus} // Show suggestions on focus
                        onKeyDown={handleKeyDown} // Trigger search on Enter
                        className="w-full px-4 py-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    {showSuggestions && (
                        <div className="absolute top-full left-0 w-full bg-white shadow-md rounded mt-2 z-10 p-4">
                            <div className="flex justify-between text-gray-500">
                                <div className="text-sm pr-2 sm:block hidden">
                                    <p><strong>@userTag</strong> — search users by tag</p>
                                    <p><strong>u/c/p:name</strong> — filter by users/categories/posts</p>
                                    <p><strong>d:date</strong> — filter by date</p>
                                </div>
                                <button
                                    onMouseDown={handleSearchButtonMouseDown} // Use onMouseDown to prevent blur trigger
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
                    {
                        user &&
                        <Link
                            to="/new-post"
                            className="bg-slate-100 text-blue-500 px-4 py-2 rounded hover:bg-blue-100 transition"
                        >
                            <span className="sm:block hidden">Add post</span>
                            <span className="block sm:hidden">Add</span>
                        </Link>

                    }
                    <UserDropdown />
                </div>
            </nav>

            {/* Меню для мобильных */}
            {isMenuOpen && (
                <div className="xl:hidden bg-blue-500 text-white py-4">
                    <ul className="space-y-4 text-left">
                        <li>
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2">🏠 Home</Link>
                        </li>
                        <li>
                            <Link to="/posts" onClick={() => setIsMenuOpen(false)} className="block py-2">📝 Posts</Link>
                        </li>
                        <li>
                            <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="block py-2">📂 Categories</Link>
                        </li>
                        <li>
                            <button onClick={() => { handleRandomClick(); setIsMenuOpen(false); }} className="block py-2">🎲 Random</button>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}

export default Header;
