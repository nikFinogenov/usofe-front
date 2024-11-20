import React, { useState, useContext } from 'react';
// import DOMPurify from 'dompurify'; // Импортируем DOMPurify
import died from '../assets/died.png';
import { SlArrowDownCircle, SlArrowUpCircle } from "react-icons/sl";
import { updateCommentLike, deleteCommentLike } from '../services/commentService';
import { AuthContext } from '../context/AuthContext';
import { NotifyContext } from '../context/NotifyContext';

function Comment({ comment, replies }) {
    const { id, content, user: commentAuthor, likes, replyId } = comment;
    const showNotification = useContext(NotifyContext);
    const { user } = useContext(AuthContext);
    const [showReplies, setShowReplies] = useState(false);
    const [likesCount, setLikesCount] = useState(likes.filter(like => like.type === 'like').length);
    const [dislikesCount, setDislikesCount] = useState(likes.filter(like => like.type === 'dislike').length);
    const [liked, setLiked] = useState(likes.some(like => like.type === 'like' && like.userId === user?.id));
    const [disliked, setDisliked] = useState(likes.some(like => like.type === 'dislike' && like.userId === user?.id));
    const [isFetchingLike, setIsFetchingLike] = useState(false);

    const toggleReplies = () => setShowReplies(!showReplies);

    const handleLike = async () => {
        if (isFetchingLike) return;
        setIsFetchingLike(true);

        try {
            if (liked) {
                await deleteCommentLike(id);
                setLikesCount(prev => prev - 1);
                setLiked(false);
            } else {
                await updateCommentLike(id, 'like');
                setLikesCount(prev => prev + 1);
                setLiked(true);
                if (disliked) {
                    setDisliked(false);
                    setDislikesCount(prev => prev - 1);
                }
            }
        } catch (error) {
            showNotification('Failed to like the comment.', 'error');
        } finally {
            setIsFetchingLike(false);
        }
    };

    const handleDislike = async () => {
        if (isFetchingLike) return;
        setIsFetchingLike(true);

        try {
            if (disliked) {
                await deleteCommentLike(id);
                setDislikesCount(prev => prev - 1);
                setDisliked(false);
            } else {
                await updateCommentLike(id, 'dislike');
                setDislikesCount(prev => prev + 1);
                setDisliked(true);
                if (liked) {
                    setLiked(false);
                    setLikesCount(prev => prev - 1);
                }
            }
        } catch (error) {
            showNotification('Failed to dislike the comment.', 'error');
        } finally {
            setIsFetchingLike(false);
        }
    };

    const rating = likesCount - dislikesCount;

    // Очистка HTML с использованием DOMPurify
    // const sanitizedContent = DOMPurify.sanitize(content);

    return (
        <div className={`mb-4 pb-4 relative ${replyId ? 'pl-10' : 'border-b-2'}`}>
            <div className="flex items-center mb-2">
                <img
                    src={commentAuthor ? commentAuthor.profilePicture : died}
                    alt="Commentator"
                    className="w-8 h-8 rounded-full mr-2"
                />
                <h4 className="font-semibold text-gray-800">
                    {commentAuthor ? commentAuthor.fullName : <i>Deleted account</i>}
                </h4>
                {replyId && <span className="text-sm text-gray-500 ml-2">replied</span>}
            </div>

            {/* Отображение HTML-контента */}
            <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: content }}
            ></div>

            <div className="flex justify-between items-center mt-2 text-gray-500 text-sm">
                <div className="flex items-center">
                    <button onClick={handleLike}>
                        <SlArrowUpCircle
                            className={`text-lg ${liked ? 'text-blue-500' : 'text-gray-400'}`}
                        />
                    </button>
                    <span className="mx-2 mb-1 text-xl">|</span>
                    <button onClick={handleDislike}>
                        <SlArrowDownCircle
                            className={`text-lg ${disliked ? 'text-red-500' : 'text-gray-400'}`}
                        />
                    </button>
                    <span className="mx-4 text-lg font-semibold">
                        <span
                            className={`${
                                rating > 0 ? 'text-green-600' : rating < 0 ? 'text-red-600' : 'text-gray-500'
                            }`}
                        >
                            {rating}
                        </span>
                    </span>
                </div>
                {replies?.length > 0 ? (
                    <button onClick={toggleReplies} className="text-blue-500 ml-4">
                        {showReplies ? 'Hide Replies' : 'Show Replies'}
                    </button>
                ) : comment.replyId ? (
                    ''
                ) : (
                    'No replies'
                )}
            </div>
            {showReplies && replies && (
                <div className="pl-10 mt-5">
                    {replies.map(reply => (
                        <Comment key={reply.id} comment={reply} replies={[]} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Comment;
