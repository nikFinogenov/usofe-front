// FilterDropdown.js
import React from 'react';

const FilterDropdown = ({ filterOption, onFilterChange, isAuthor }) => {
    return (
        isAuthor && (
            <div className="relative">
                <select
                    value={filterOption}
                    onChange={onFilterChange}
                    className="block w-full p-2 pl-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        )
    );
};

export default FilterDropdown;