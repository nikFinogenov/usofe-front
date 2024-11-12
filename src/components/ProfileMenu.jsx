import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProfileMenu() {
    const { user, logout } = useContext(AuthContext);
    const [isMenuVisible, setMenuVisible] = useState(false);

    // Функция для открытия/закрытия меню при клике
    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };

    // Закрыть меню при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.closest('#dropdownAvatarNameButton') === null) {
                setMenuVisible(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="relative">
            {/* Кнопка с аватаркой пользователя */}
            <button
                id="dropdownAvatarNameButton"
                onClick={toggleMenu}
                className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full 
                hover:text-yellow-300 md:me-0
                focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
                type="button"
            >
                <span className="sr-only">Open user menu</span>
                <img
                    className="w-8 h-8 me-2 rounded-full"
                    src={user ? user.profilePicture : `${process.env.REACT_APP_FILE}/noname.png`}
                    alt={user ? user.fullName : 'Guest'}
                />
                {user ? user.fullName : 'Guest'}
                <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>

            {/* Выпадающее меню профиля */}
            {isMenuVisible && user && (
                <div
                    id="dropdownAvatarName"
                    className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg z-20"
                >
                    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        <div className="font-medium">{user.fullName}</div>
                        <div className="truncate">{user.email}</div>
                    </div>
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                            <Link
                                to={`/profile/${user.id}`}
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                Профиль
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/settings"
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                Настройки
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                                Выйти
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {/* Кнопки для логина и регистрации, если пользователь не залогинен */}
            {/* {!user && (
                <div className="flex flex-col items-center mt-2">
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Войти
                    </Link>
                    <Link to="/register" className="text-blue-500 hover:underline mt-1">
                        Зарегистрироваться
                    </Link>
                </div>
            )} */}
        </div>
    );
}

export default ProfileMenu;
