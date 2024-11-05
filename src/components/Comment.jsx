// components/Comment.jsx
import React from 'react';

function Comment({ comment }) {
    const { content, user, likes } = comment;

    // Разделяем лайки и дизлайки для комментария
    const likesCount = likes.filter(like => like.type === 'like').length;
    const dislikesCount = likes.filter(like => like.type === 'dislike').length;

    return (
        <div className="mb-4 border-b pb-4">
            <div className="flex items-center mb-2">
                <img src={user.profilePicture} alt="Commentator" className="w-8 h-8 rounded-full mr-2" />
                <h4 className="font-semibold text-gray-800">{user.fullName}</h4>
            </div>
            <p className="text-gray-700">{content}</p>
            <div className="flex justify-between items-center mt-2 text-gray-500 text-sm">
                <span>👍 {likesCount} likes</span>
                <span>👎 {dislikesCount} dislikes</span>
            </div>
        </div>
    );
}

export default Comment;
