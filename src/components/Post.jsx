import React from 'react';
import CategoryTags from './CategoryTags';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

function Post({ post }) {
    const renderRating = (rating) => {
        if (rating > 0) {
            return <FaArrowUp className="text-green-500" />;
        } else if (rating < 0) {
            return <FaArrowDown className="text-red-500" />;
        } else {
            return <FaMinus className="text-gray-500" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            
            <p className="text-gray-700 mb-4">
                {post.content.length > 50 ? `${post.content.slice(0, 50)}...` : post.content}
            </p>
            
            <CategoryTags categories={post.categories} />

            <div className="flex justify-between items-center text-gray-500 text-sm my-4 border-t border-gray-200 pt-4">
                <div className="flex flex-col items-start">
                    <span>❤️ Likes: {post.likeCount}</span>
                    <br />
                    <span>👎 Dislikes: {post.dislikeCount}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span>👀 Views: {post.views}</span>
                    <br />
                    <span>💬 Comments: {post.commentCount}</span>
                </div>
            </div>

            <div className="mt-auto flex items-center pt-4 border-t border-gray-200">
                <div className="flex items-center mr-3">
                    <span className="text-gray-600 text-sm font-bold mr-1">{post.user.rating}</span>
                    {renderRating(post.user.rating)}
                </div>
                <img
                    src={post.user.profilePicture}
                    alt={post.user.fullName}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                    <p className="text-sm font-medium">{post.user.fullName}</p>
                    <p className="text-xs text-gray-400">@{post.user.login}</p>
                </div>
            </div>
        </div>
    );
}

export default Post;
