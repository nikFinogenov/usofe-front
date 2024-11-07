// components/Comment.jsx
import React from 'react';

function Comment({ comment, isReply = false }) {
    const { content, user, likes, replyId } = comment;

    // Separate likes and dislikes for the comment
    const likesCount = likes.filter(like => like.type === 'like').length;
    const dislikesCount = likes.filter(like => like.type === 'dislike').length;

    return (
        <div className={`mb-4 pb-4 relative ${isReply ? 'pl-10' : 'border-b-2'}`}>
            <div className="flex items-center mb-2">
                <img src={user.profilePicture} alt="Commentator" className="w-8 h-8 rounded-full mr-2" />
                <h4 className="font-semibold text-gray-800">{user.fullName}</h4>
                {replyId && <span className="text-sm text-gray-500 ml-2">replied</span>}
            </div>
            <p className="text-gray-700">{content}</p>
            <div className="flex justify-between items-center mt-2 text-gray-500 text-sm">
                <span>👍 {likesCount} likes</span>
                <span>👎 {dislikesCount} dislikes</span>
            </div>
            {isReply && (
                <div className="absolute bottom-0 left-10 right-10 border-b-2 border-gray-300" style={{ width: '95%' }}></div>
            )}
        </div>
    );
}

export default Comment;
