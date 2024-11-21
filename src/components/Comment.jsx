import React, { useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import died from '../assets/died.png';
import { SlArrowDownCircle, SlArrowUpCircle } from "react-icons/sl";
import { updateCommentLike, deleteCommentLike, addComment } from '../services/commentService';
import { AuthContext } from '../context/AuthContext';
import { NotifyContext } from '../context/NotifyContext';
import { GoReply } from "react-icons/go";
import CommentEditorMarkdown from './CommentEditorMarkdown';
import { IoIosClose } from "react-icons/io";

function Comment({ comment, replies, onReplyAdded }) {
    const { id, content, user: commentAuthor, likes, replyId } = comment;
    const showNotification = useContext(NotifyContext);
    const { user } = useContext(AuthContext);
    const [showReplies, setShowReplies] = useState(false);
    const [likesCount, setLikesCount] = useState(likes.filter(like => like.type === 'like').length);
    const [dislikesCount, setDislikesCount] = useState(likes.filter(like => like.type === 'dislike').length);
    const [liked, setLiked] = useState(likes.some(like => like.type === 'like' && like.userId === user?.id));
    const [disliked, setDisliked] = useState(likes.some(like => like.type === 'dislike' && like.userId === user?.id));
    const [isFetchingLike, setIsFetchingLike] = useState(false);
    const [showReplyDialog, setShowReplyDialog] = useState(false);

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

    const handleReplySubmit = async (replyContent) => {
        try {
            const originalCommentId = comment.replyId ? comment.replyId : comment.id;
            // Создаем новый комментарий с `replyId`, который равен `id` текущего комментария
            const newReply = await addComment(comment.postId, replyContent, originalCommentId); // Используем postId и текущий id как replyId
            if (onReplyAdded) onReplyAdded(newReply); // Вызываем callback, чтобы обновить родительское состояние
            // Обновляем локальное состояние (например, если есть механизм для обновления комментариев в глобальном или локальном состоянии)
            showNotification('Reply added successfully!', 'success');
        } catch (error) {
            console.error('Failed to add reply:', error);
            showNotification('Failed to add reply.', 'error');
        } finally {
            setShowReplyDialog(false); // Закрываем диалоговое окно
        }
    };

    const rating = likesCount - dislikesCount;

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
                <button onClick={() => setShowReplyDialog(true)} className="ml-auto">
                    <GoReply className="text-lg" />
                </button>
            </div>

            <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>

            <div className="flex justify-between items-center mt-2 text-gray-500 text-sm">
                <div className="flex items-center">
                    <button onClick={handleLike}>
                        <SlArrowUpCircle className={`text-lg ${liked ? 'text-blue-500' : 'text-gray-400'}`} />
                    </button>
                    <span className="mx-2 mb-1 text-xl">|</span>
                    <button onClick={handleDislike}>
                        <SlArrowDownCircle className={`text-lg ${disliked ? 'text-red-500' : 'text-gray-400'}`} />
                    </button>
                    <span className="mx-4 text-lg font-semibold">
                        <span className={`${rating > 0 ? 'text-green-600' : rating < 0 ? 'text-red-600' : 'text-gray-500'}`}>
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
                        <Comment key={reply.id} comment={reply} replies={[]} onReplyAdded={onReplyAdded} />
                    ))}
                </div>
            )}

            {showReplyDialog && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md w-1/2 relative">
                        <button
                            onClick={() => setShowReplyDialog(false)}
                            className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800"
                        >
                            <IoIosClose />
                        </button>
                        <h3 className="text-lg font-semibold mb-4">Reply to Comment</h3>
                        <CommentEditorMarkdown
                            onSubmit={handleReplySubmit}
                            height="200px"
                        />
                    </div>
                </div>
            )}

        </div>
    );
}

export default Comment;
