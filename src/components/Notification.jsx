import React from 'react';

function Notification({ text, type, onClose }) {
    let alertClass = '';
    let iconPath = '';
    let bgColor = '';
    let textColor = '';

    switch (type) {
        case 'info':
            alertClass = 'text-blue-800 bg-blue-50';
            iconPath = 'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z';
            bgColor = 'bg-blue-50';
            textColor = 'text-blue-800';
            break;

        case 'error':
            alertClass = 'text-red-800 bg-red-50';
            iconPath = 'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z';
            bgColor = 'bg-red-50';
            textColor = 'text-red-800';
            break;

        case 'success':
            alertClass = 'text-green-800 bg-green-50';
            iconPath = 'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z';
            bgColor = 'bg-green-50';
            textColor = 'text-green-800';
            break;

        case 'warning':
            alertClass = 'text-yellow-800 bg-yellow-50';
            iconPath = 'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z';
            bgColor = 'bg-yellow-50';
            textColor = 'text-yellow-800';
            break;

        default:
            break;
    }

    return (
        <div className={`fixed top-16 right-5 z-50 p-4 rounded-lg shadow-lg ${bgColor} ${alertClass} flex items-center`}>
            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d={iconPath} />
            </svg>
            <div className={`ml-3 text-sm font-medium ${textColor}`}>
                {text}
            </div>
            <button
                type="button"
                onClick={onClose}
                className="ml-auto -mx-1.5 -my-1.5 p-1.5 hover:bg-gray-200 inline-flex items-center justify-center h-8 w-8 rounded-lg focus:ring-2"
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </div>
    );
}

export default Notification;
