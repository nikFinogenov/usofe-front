// src/components/Post.jsx
import React from 'react';

function Post({ post }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-gray-500 text-sm mt-4">
                Published on: {new Date(post.publishDate).toLocaleDateString()}
            </p>
            <div className="flex items-center mt-4">
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
