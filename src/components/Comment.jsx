import React, { useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypePrism from 'rehype-prism-plus';
import died from '../assets/died.png';
import { SlArrowDownCircle, SlArrowUpCircle } from "react-icons/sl";
import { updateCommentLike, deleteCommentLike, addComment, updateComment, deleteComment } from '../services/commentService';
import { AuthContext } from '../context/AuthContext';
import { NotifyContext } from '../context/NotifyContext';
import { GoReply } from "react-icons/go";
import { Link } from 'react-router-dom';
import CommentEditorMarkdown from './CommentEditorMarkdown';
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import ProfilePreview from './ProfilePreview';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';

function Comment({ comment, replies, onReplyAdded, onDelete }) {
    const { id, content: initialContent, user: commentAuthor, likes, replyId, createdAt } = comment;
    const showNotification = useContext(NotifyContext);
    const { user } = useContext(AuthContext);
    const [showReplies, setShowReplies] = useState(false);
    const [likesCount, setLikesCount] = useState(likes.filter(like => like.type === 'like').length);
    const [dislikesCount, setDislikesCount] = useState(likes.filter(like => like.type === 'dislike').length);
    const [liked, setLiked] = useState(likes.some(like => like.type === 'like' && like.userId === user?.id));
    const [disliked, setDisliked] = useState(likes.some(like => like.type === 'dislike' && like.userId === user?.id));
    const [isFetchingLike, setIsFetchingLike] = useState(false);
    const [showReplyDialog, setShowReplyDialog] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(initialContent);
    const [showProfilePreview, setShowProfilePreview] = useState(false);
    const [hoverTimer, setHoverTimer] = useState(null);

    const handleMouseEnter = () => {
        clearTimeout(hoverTimer); // Очистить таймер, если он был запущен
        setHoverTimer(
            setTimeout(() => {
                setShowProfilePreview(true);
            }, 300) // Задержка перед показом превью
        );
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimer); // Очистить таймер, если он был запущен
        setHoverTimer(
            setTimeout(() => {
                setShowProfilePreview(false);
            }, 300) // Задержка перед скрытием превью
        );
    };
    const handleMenuAction = (action) => {
        switch (action) {
            case 'Edit':
                handleEdit();
                break;
            case 'Hide':
                handleHide();
                break;
            case 'Delete':
                setShowDeleteConfirm(true);
                break;
            default:
                break;
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleEditSubmit = async (newContent) => {
        try {
            await updateComment(id, newContent);
            setContent(newContent);
            showNotification('Comment updated successfully!', 'success');
            setIsEditing(false);
        } catch (error) {
            // console.log(error);
            showNotification('Failed to update comment.', 'error');
        }
    };

    const handleHide = async () => {
        try {
            // await hideComment(id, isHidden);
            const newStatus = isHidden ? 'active' : 'inactive';
            await updateComment(id, null, newStatus);
            setIsHidden(!isHidden);
            showNotification('Comment hidden successfully!', 'success');
        } catch (error) {
            showNotification('Failed to hide comment.', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteComment(id);
            onDelete(id);
            setShowDeleteConfirm(false);
            showNotification('Comment deleted successfully!', 'success');
        } catch (error) {
            showNotification('Failed to delete comment.', 'error');
        }
    };

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
            {isHidden && (
                <div className="absolute inset-0 bg-black/30 flex justify-center items-center pointer-events-none rounded-lg shadow-lg">
                    <span className="text-4xl font-bold text-white opacity-50 transform rotate-[-15deg]">
                        INACTIVE
                    </span>
                </div>
            )}
            <div className="flex items-center mb-2">
                {commentAuthor ? (
                    <div
                        className="flex items-center relative group"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link
                            to={`/user/${commentAuthor.id}`}
                            className="flex items-center text-left"
                        >
                            <img
                                src={commentAuthor.profilePicture}
                                alt={commentAuthor.fullName}
                                className="w-8 h-8 rounded-full mr-2"
                            />
                            <div>
                                <p className="text-sm font-medium">
                                    {commentAuthor.fullName}
                                </p>
                            </div>
                        </Link>

                        {showProfilePreview && (
                            <div
                                className="absolute top-full left-0 mt-2 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-2 transition-opacity duration-300 ease-in-out"
                                onMouseEnter={handleMouseEnter} // Keep preview open when hovered
                                onMouseLeave={handleMouseLeave} // Hide preview with delay
                            >
                                <ProfilePreview userId={commentAuthor.id} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center">
                        <img
                            src={died}
                            alt="Deleted account"
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                            <p className="text-sm font-medium">
                                <i>Deleted account</i>
                            </p>
                        </div>
                    </div>
                )}

                {<span className="text-sm text-gray-500 ml-2">{replyId ? "replied" : "answered"} on {new Date(createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })}</span>}

                <button onClick={() => setShowReplyDialog(true)} className="ml-auto">
                    <GoReply className="text-lg" />
                </button>
            </div>
            {isEditing ? (
                <div className='flex'>
                    <CommentEditorMarkdown
                        inputValue={content}
                        onSubmit={handleEditSubmit}
                    />
                    <button onClick={() => setIsEditing(false)} className="self-start ml-1 text-2xl mt-4 px-1 py-1 bg-red-500 text-white rounded">
                        <IoIosClose />
                    </button>
                </div>
            ) : (
                <div className='flex'>
                    <ReactMarkdown className="prose break-words" remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypePrism]} >
                        {content}
                    </ReactMarkdown>
                    {user?.id === commentAuthor.id && (
                        <Menu
                            menuButton={<MenuButton className='ml-auto self-start'><IoSettingsOutline /></MenuButton>}
                            key={'right'}
                            direction={'right'}
                            align={'center'}
                            position={'anchor'}
                            viewScroll={'auto'}
                            arrow={true}
                            gap={12}
                            shift={12}
                        >
                            {['Edit', 'Hide', 'Delete'].map((action) => (
                                <MenuItem key={action} onClick={() => handleMenuAction(action)}>
                                    {(action === 'Hide' && isHidden) ? `Show` : action}
                                </MenuItem>
                            ))}
                        </Menu>
                    )}
                </div>
            )}

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
            {showDeleteConfirm && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-6 rounded-md w-1/3 z-60">
                        <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this comment?</h3>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="text-sm text-gray-500 hover:underline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Comment;
