import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importing chevron icons
import CategoryTags from './CategoryTags';

const SearchResult = ({ title, data, linkPrefix }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    function stripMarkdown(content) {
        return content.replace(/[#_*~`>|-]/g, '').replace(/\[.*?\]\(.*?\)/g, '').trim();
    }

    const handleToggle = () => setIsCollapsed(!isCollapsed);

    const handleItemClick = (id, title) => {
        if (title === "Categories") {
            navigate(`${linkPrefix}/${id}/posts`);
        } else {
            navigate(`${linkPrefix}/${id}`);
        }
    };

    if (!data || data.length === 0) return null; // If no data, don't render the block

    return (
        <div className="search-result mb-6">
            <div
                className="flex items-center justify-between cursor-pointer bg-gray-100 p-3 rounded-lg mb-4"
                onClick={handleToggle}
            >
                <h2 className="text-2xl font-bold">{title}</h2>
                <button className="text-sm text-blue-500">
                    {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
            </div>

            {!isCollapsed && (
                <ul className="list-none p-0">
                    {data.map((item) => (
                        <li
                            key={item.id}
                            className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-md flex flex-col cursor-pointer hover:bg-gray-100"
                            onClick={() => handleItemClick(item.id, title)}
                        >
                            {title === "Users" && (
                                <>
                                    <div className="flex items-center mb-2">
                                        <img
                                            src={item.profilePicture}
                                            alt={item.fullName}
                                            className="w-12 h-12 rounded-full mr-4"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold">{item.fullName}</h3>
                                            <p className="text-gray-600">@{item.login}</p>
                                            <p className="text-gray-600">Rating: {item.rating}</p>
                                            <p className="text-gray-600">Role: {item.role}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                            {title === "Posts" && (
                                <>
                                    <div className='flex justify-between'>
                                        <div>
                                            {/* Show inactive badge if the post is inactive */}
                                            {item.status === 'inactive' && (
                                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                                                    Inactive
                                                </span>
                                            )}
                                            <h3 className="text-lg font-semibold">{item.title}</h3>

                                            <p className="text-gray-600">
                                                {stripMarkdown(item.content).slice(0, 50) +
                                                    (item.content.length > 50 ? '...' : '')}
                                            </p>
                                            <p className="text-gray-500">
                                                Published by <b>{item.user ? `@${item.user.login}` : "Deleted user"}</b> on: {new Date(item.publishDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-gray-500">Views: {item.views}</p>
                                        </div>
                                        <CategoryTags categories={item.categories} maxVisible={5} />
                                    </div>
                                </>
                            )}
                            {title === "Categories" && (
                                <>
                                    <h3 className="mb-2">
                                        <span className='bg-blue-100 text-blue-600 text-xs font-bold mr-2 mb-2 px-3 py-1 rounded-full'>
                                            {item.title}
                                        </span>
                                    </h3>
                                    <p className="text-gray-600">Posts with category: {item.postCount}</p>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchResult;