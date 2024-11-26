import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostById, fetchPostComments, updatePostLike, deletePostLike, deletePostById, updatePost } from '../services/postService';
import { addComment } from '../services/commentService';
import Comment from '../components/Comment';
import CategoryTags from '../components/CategoryTags';
import LoadingSpinner from '../components/LoadingSpinner';
import LikeButton from '../components/LikeButton';
import DislikeButton from '../components/DislikeButton';
import { NotifyContext } from '../context/NotifyContext';
import died from '../assets/died.png';
import { AuthContext } from '../context/AuthContext';
// import CommentEditor from '../components/CommentEditor';
import CommentEditorMarkdown from '../components/CommentEditorMarkdown'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, useNavigate } from 'react-router-dom';

function FullPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const showNotification = useContext(NotifyContext);
    const { user } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [postComments, setPostComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFetchingLike, setIsFetchingLike] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);
    const [liked, setLiked] = useState(false);  // Отслеживаем, лайкнут ли пост
    const [disliked, setDisliked] = useState(false);  // Отслеживаем, дизлайкнут ли пост
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const postData = await fetchPostById(id);
                const commentsData = await fetchPostComments(id);
                setPost(postData);
                setPostComments(commentsData);
                // console.log(postComments);

                // Подсчет лайков и дизлайков
                const likes = postData.likes || [];
                setLikesCount(likes.filter((like) => like.type === 'like').length);
                setDislikesCount(likes.filter((like) => like.type === 'dislike').length);
                // console.log(postData);

                // Проверка, был ли пост лайкнут или дизлайкнут
                const userLike = likes.find((like) => like.userId === user?.id);  // Пример: проверка по userId
                // console.log(userLike);
                if (userLike) {
                    if (userLike.type === 'like') {
                        setLiked(true);
                    } else if (userLike.type === 'dislike') {
                        setDisliked(true);
                    }
                }
            } catch (error) {
                console.error('Failed to load post:', error);
                showNotification('Failed to load post data.', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [id, showNotification, user]);

    const handleLike = async () => {
        if (isFetchingLike) return;
        setIsFetchingLike(true);

        try {
            // If the post is already liked, delete the like
            if (liked) {
                await deletePostLike(id);  // Remove the like
                setLiked(false);
                setLikesCount((prevCount) => prevCount - 1);
            } else {
                // If not liked yet, add the like (this could be implemented via another API call)
                await updatePostLike(id, 'like');
                setLiked(true);
                setLikesCount((prevCount) => prevCount + 1);

                // If the post was disliked, remove the dislike
                if (disliked) {
                    setDisliked(false);
                    setDislikesCount((prevCount) => prevCount - 1);
                }
            }
        } catch (error) {
            showNotification('Failed to like the post.', 'error');
        } finally {
            setIsFetchingLike(false);
        }
    };

    const handleDislike = async () => {
        if (isFetchingLike) return;
        setIsFetchingLike(true);

        try {
            // If the post is already disliked, delete the dislike
            if (disliked) {
                await deletePostLike(id);  // Remove the dislike
                setDisliked(false);
                setDislikesCount((prevCount) => prevCount - 1);
            } else {
                // If not disliked yet, add the dislike (this could be implemented via another API call)
                await updatePostLike(id, 'dislike');
                setDisliked(true);
                setDislikesCount((prevCount) => prevCount + 1);

                // If the post was liked, remove the like
                if (liked) {
                    setLiked(false);
                    setLikesCount((prevCount) => prevCount - 1);
                }
            }
        } catch (error) {
            showNotification('Failed to dislike the post.', 'error');
        } finally {
            setIsFetchingLike(false);
        }
    };
    const handleDeletePost = async () => {
        try {
            await deletePostById(post.id); // Вызываем API для удаления поста
            // onDelete(post.id); // Вызываем callback, чтобы обновить состояние в родительском компоненте
            setShowDeleteConfirm(false); // Закрываем модальное окно
            navigate('/');
            showNotification('Post deleted successfully!', 'success'); // Отображаем уведомление
        } catch (error) {
            showNotification('Failed to delete post.', 'error'); // Уведомление об ошибке
        }
    };
    const handleAddComment = async (content) => {
        try {
            const newComment = await addComment(id, content); // Предполагаем, что `addComment` добавляет комментарий
            setPostComments((prevComments) => [...prevComments, newComment]);
            showNotification('Comment added successfully!', 'success');
        } catch (error) {
            console.error('Failed to add comment:', error);
            showNotification('Failed to add comment.', 'error');
        }
    };
    const handleHide = async () => {
        try {
            const newStatus = isHidden ? 'active' : 'inactive';
            await updatePost(id, null, null, null, newStatus);
            setIsHidden(!isHidden);
            showNotification('Post hidden successfully!', 'success');
        } catch (error) {
            showNotification('Failed to hide post.', 'error');
        }
    };
    if (loading) return <LoadingSpinner />;
    if (!post) return <div>Post not found.</div>;

    const { title, content, publishDate, views, user: author, categories } = post;
    const getReplies = (commentId) =>
        postComments.filter((reply) => reply.replyId === commentId);
    // console.log(postComments);
    return (
        <div className="max-w-2xl mx-auto pt-16 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-4 mt-5">
                {author ? (
                    <div className="flex items-center">
                        <img
                            src={author.profilePicture}
                            alt="Author"
                            className="w-10 h-10 rounded-full mr-2"
                        />
                        <h2 className="font-semibold text-lg">{author.fullName}</h2>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <img
                            src={died}
                            alt="Author"
                            className="w-10 h-10 rounded-full mr-2"
                        />
                        <h2 className="font-semibold text-lg">
                            <i>Deleted account</i>
                        </h2>
                    </div>
                )}

                {user?.id === author.id && (
                    <div className="flex space-x-2">
                        <button
                            className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-400 transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleHide();
                            }}
                        >
                            {isHidden ? 'Show' : 'Hide'}
                        </button>
                        <Link
                            to={`/edit-post/${post.id}`}
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-400 transition"
                        >
                            Edit
                        </Link>
                        <button
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-400 transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                // handleDeletePost(post.id);
                                setShowDeleteConfirm(true);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="text-gray-500 text-sm mb-2">
                Published on {new Date(publishDate).toLocaleDateString()} | Views: {views}
            </p>
            {/* <p className="text-gray-700 mb-4">{content}</p> */}
            <div className="prose mb-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>

            <CategoryTags categories={categories} maxVisible={categories.length} />

            <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
                <div className="flex items-center gap-4">
                    <LikeButton
                        liked={liked}  // Передаем актуальное состояние
                        onClick={handleLike}
                    />
                    <DislikeButton
                        disliked={disliked}  // Передаем актуальное состояние
                        onClick={handleDislike}
                    />
                </div>
                <div className="flex gap-4">
                    <span>❤️ {likesCount}</span>
                    <span>👎 {dislikesCount}</span>
                </div>
            </div>

            <div className="my-8">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                {postComments.length ?
                    postComments.filter((comment) => !comment.replyId)
                        .map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                replies={getReplies(comment.id)}
                                onReplyAdded={(newReply) => setPostComments((prev) => [...prev, newReply])}
                                onDelete={(commentId) => setPostComments((prev) => prev.filter(comment => comment.id !== commentId))}
                            />
                        )) :
                    <p className='text-s'>No comments found, be first!</p>}
                <h3 className="text-xl font-semibold mt-8">Add a Comment</h3>
                {/* <CommentEditor onSubmit={handleAddComment} /> */}
                <CommentEditorMarkdown onSubmit={handleAddComment} height={'200px'} />
            </div>
            {showDeleteConfirm && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-6 rounded-md w-1/3 z-60">
                        <h3 className="text-lg font-semibold mb-4">
                            Are you sure you want to delete this post?
                        </h3>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="text-sm text-gray-500 hover:underline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePost}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isHidden && (
                <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-gray-200 border border-gray-300 p-4 rounded shadow text-center animate-slow-pulse max-w-md w-full">
                    <p className="text-gray-600 text-3xl font-medium">
                        This post is <span className='text-red-500'>INACTIVE</span>. Please review the content privately and contact the administration for restoration if needed.
                    </p>
                </div>
            )}

        </div>
    );
}

export default FullPost;
