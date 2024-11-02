// src/components/Post.jsx
import React from 'react';

function Post({ post, onViewMore  }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.content.length > 25 ? `${post.content.slice(0, 100)}...` : post.content}</p>
            <br />
            <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                <div className='flex flex-col'>
                    <span>❤️ Likes: {post.likeCount}</span>
                    <span>👎 Dislikes: {post.dislikeCount}</span>
                </div>
                <div className='flex flex-col'>
                    <span>👀 Views: {post.views}</span>
                    <span>💬 Comments: {post.commentCount}</span>
                </div>
            </div>
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
            <button
                onClick={() => onViewMore(post.id)}
                className="text-blue-500 hover:underline"
            >
                Смотреть больше
            </button>
        </div>
    );
}

export default Post;
