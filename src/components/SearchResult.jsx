import React from 'react';
import { Link } from 'react-router-dom';

const SearchResult = ({ title, data, linkPrefix }) => {
  return (
    <div className="search-result mb-6">
      {data && data.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <ul className="list-none p-0">
            {data.map((item) => (
              <li key={item.id} className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-md flex flex-col">
                {title === "Users" && (
                  <>
                    <div className="flex items-center mb-2">
                      <img src={item.profilePicture} alt={item.fullName} className="w-12 h-12 rounded-full mr-4" />
                      <div>
                        <h3 className="text-lg font-semibold">{item.fullName}</h3>
                        <p className="text-gray-600">Email: {item.email}</p>
                        <p className="text-gray-600">Rating: {item.rating}</p>
                        <p className="text-gray-600">Role: {item.role}</p>
                      </div>
                    </div>
                    <Link to={`${linkPrefix}/${item.id}`} className="text-blue-500 hover:underline">View Profile</Link>
                  </>
                )}
                {title === "Posts" && (
                  <>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.content}</p>
                    <p className="text-gray-500">Published on: {new Date(item.publishDate).toLocaleDateString()}</p>
                    <p className="text-gray-500">Views: {item.views}</p>
                    <Link to={`${linkPrefix}/${item.id}`} className="text-blue-500 hover:underline">View Post</Link>
                  </>
                )}
                {title === "Categories" && (
                  <>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <Link to={`${linkPrefix}/${item.id}/posts`} className="text-blue-500 hover:underline">View Category</Link>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Если не найдено ни пользователей, ни постов */}
      {/* {data.length === 0 && <p className="text-gray-500">No results found.</p>} */}
    </div>
  );
};

export default SearchResult;