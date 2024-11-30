import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importing chevron icons

const SearchResult = ({ title, data, linkPrefix }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (id, title) => {
    if (title === "Categories") {
      // Navigate to the category's posts page
      navigate(`${linkPrefix}/${id}/posts`);
    } else {
      // For other titles (Users and Posts), navigate normally
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
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.content}</p>
                  <p className="text-gray-500">
                    Published on: {new Date(item.publishDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500">Views: {item.views}</p>
                </>
              )}
              {title === "Categories" && (
                <>
                  <h3 className="mb-2"><span className='bg-blue-100 text-blue-600 text-xs font-bold mr-2 mb-2 px-3 py-1 rounded-full'>
                  {item.title}</span></h3>
                  <p className="text-gray-600">Posts with category: {item.postCount}</p>
                  {/* <p className="text-gray-500">Explore posts in this category.</p> */}
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
