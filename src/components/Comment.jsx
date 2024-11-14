// components/Comment.jsx
import React, { useState } from 'react';
import died from '../assets/died.png'

function Comment({ comment, replies }) {
    const { content, user, likes, replyId } = comment;
    const [showReplies, setShowReplies] = useState(false);

    const likesCount = likes.filter(like => like.type === 'like').length;
    const dislikesCount = likes.filter(like => like.type === 'dislike').length;

    const toggleReplies = () => setShowReplies(!showReplies);

    return (
        <div className={`mb-4 pb-4 relative ${replyId ? 'pl-10' : 'border-b-2'}`}>
            {
                user ? (<div className="flex items-center mb-2">
                    <img src={user.profilePicture} alt="Commentator" className="w-8 h-8 rounded-full mr-2" />
                    <h4 className="font-semibold text-gray-800">{user.fullName}</h4>
                    {replyId && <span className="text-sm text-gray-500 ml-2">replied</span>}
                </div>) : (<div className="flex items-center mb-2">
                    <img src={died} alt="Commentator" className="w-8 h-8 rounded-full mr-2" />
                    <h4 className="font-semibold text-gray-800"><i>Deleted account</i></h4>
                    {replyId && <span className="text-sm text-gray-500 ml-2">replied</span>}
                </div>)
            }

            <p className="text-gray-700">{content}</p>
            <div className="flex justify-between items-center mt-2 text-gray-500 text-sm">
                <div className="flex items-center">
                    <span className="mr-4">👍 {likesCount}</span>
                    <span>👎 {dislikesCount}</span>
                </div>
                {replies?.length > 0 ? (
                    <button onClick={toggleReplies} className="text-blue-500 ml-4">
                        {showReplies ? 'Hide Replies' : 'Show Replies'}
                    </button>
                ) : comment.replyId ? ('') : ('No replies')}
            </div>
            {showReplies && replies && (
                <div className="pl-10 mt-5">
                    {replies.map(reply => (
                        <Comment key={reply.id} comment={reply} replies={[]} />
                    ))}
                </div>
            )}
            {comment.replyId && (
                <div className="absolute bottom-0 left-10 right-10 border-b-2 border-gray-300" style={{ width: '95%' }}></div>
            )}

        </div>
    );
}

export default Comment;
