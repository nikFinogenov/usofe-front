import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import noname from '../assets/noname.png'

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);  
  }, [user]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="dropdownAvatarNameButton"
        onClick={toggleDropdown}
        className="flex items-center text-sm pe-1 p-1 font-medium text-gray-900 rounded-full hover:text-white focus:text-white md:me-0 focus:ring-2 focus:ring-gray-100"
        type="button"
      >
        <span className="sr-only">Open user menu</span>
        <img
          className="w-8 h-8 me-2 rounded-full"
          src={user ? user.profilePicture : noname}
          alt="user"
        />
        <span className="hidden sm:inline">{user ? user.fullName : "Anonym"}</span>

        <svg
          className={`w-2.5 h-2.5 ms-3 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
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

      {isOpen && (
        <div
          id="dropdownAvatarName"
          className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute right-0 mt-2"
        >
          {user && (
            <div className="px-4 py-3 text-sm text-gray-900">
              <div className="font-medium">{user.role}</div>
              <div className="truncate">{user.email}</div>
            </div>
          )}
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <a
                href={user ? '/profile' : '/login'}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                {user ? "Profile" : "Login"}
              </a>
            </li>
            <li>
              <a
                href={user ? '/settings' : '/register'}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                {user ? "Settings" : "Sign up"}
              </a>
            </li>
            {
              user && (
                <li>
                  <a
                    href="/favourites"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Favourites
                  </a>
                </li>
              )
            }
          </ul>
          {user && (
            <div className="py-2">
              <a
                href="/"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={logout}
              >
                Sign out
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
