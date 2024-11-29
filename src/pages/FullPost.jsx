import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchPostById, fetchPostComments, updatePostLike, deletePostLike, deletePostById, updatePost, favouritePost, deleteFavouritePost } from '../services/postService';
import { addComment } from '../services/commentService';
import Comment from '../components/Comment';
import CategoryTags from '../components/CategoryTags';
import LoadingSpinner from '../components/LoadingSpinner';
import LikeButton from '../components/LikeButton';
import DislikeButton from '../components/DislikeButton';
import { NotifyContext } from '../context/NotifyContext';
import died from '../assets/died.png';
import { AuthContext } from '../context/AuthContext';
import CommentEditorMarkdown from '../components/CommentEditorMarkdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypePrism from 'rehype-prism-plus';
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github.css";
import Pagination from '../components/Pagination';
import FavButton from '../components/FavButton';
import ProfilePreview from '../components/ProfilePreview';
import SortDropdown from '../components/SortDropdown';  // Import the SortDropdown component
import FilterDropdown from '../components/FilterDropdown';  // Import the FilterDropdown component

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
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [favourited, setFavourited] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOption, setSortOption] = useState(sessionStorage.getItem('sortOption') || 'rating');
    const [filterOption, setFilterOption] = useState(sessionStorage.getItem('filterOption') || 'all');
    const [showProfilePreview, setShowProfilePreview] = useState(false);
    const [hoverTimer, setHoverTimer] = useState(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const postData = await fetchPostById(id);
                const commentsData = await fetchPostComments(id, currentPage, 10, sortOption, 'desc', filterOption);
                setPost(postData);
                setPostComments(commentsData.comments);
                setTotalPages(commentsData.totalPages);

                const likes = postData.likes || [];
                setLikesCount(likes.filter((like) => like.type === 'like').length);
                setDislikesCount(likes.filter((like) => like.type === 'dislike').length);

                const userLike = likes.find((like) => like.userId === user?.id);
                const isFavourited = postData.isFavourited || false;
                if (userLike) {
                    if (userLike.type === 'like') {
                        setLiked(true);
                    } else if (userLike.type === 'dislike') {
                        setDisliked(true);
                    }
                }
                if (isFavourited) setFavourited(isFavourited);
            } catch (error) {
                console.error('Failed to load post:', error);
                showNotification('Failed to load post data.', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [id, currentPage, showNotification, user, sortOption, filterOption]);

    const handleLike = async () => {
        if (isFetchingLike) return;
        setIsFetchingLike(true);

        try {
            if (liked) {
                await deletePostLike(id);
                setLiked(false);
                setLikesCount((prevCount) => prevCount - 1);
            } else {
                await updatePostLike(id, 'like');
                setLiked(true);
                setLikesCount((prevCount) => prevCount + 1);
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
            if (disliked) {
                await deletePostLike(id);
                setDisliked(false);
                setDislikesCount((prevCount) => prevCount - 1);
            } else {
                await updatePostLike(id, 'dislike');
                setDisliked(true);
                setDislikesCount((prevCount) => prevCount + 1);
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
            await deletePostById(post.id);
            setShowDeleteConfirm(false);
            navigate('/');
            showNotification('Post deleted successfully!', 'success');
        } catch (error) {
            showNotification('Failed to delete post.', 'error');
        }
    };

    const handleFav = async () => {
        if (isFetchingLike) return;
        setIsFetchingLike(true);

        try {
            if (favourited) {
                await deleteFavouritePost(id);
            } else {
                await favouritePost(id);
            }
            setFavourited(!favourited);
        } catch (error) {
            showNotification('Failed to fav the post.', 'error');
        } finally {
            setIsFetchingLike(false);
        }
    };

    const handleAddComment = async (content) => {
        try {
            const newComment = await addComment(id, content);
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

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        sessionStorage.setItem('sortOption', event.target.value)
    };

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
        sessionStorage.setItem('filterOption', event.target.value)
    };

    const handleMouseEnter = () => {
        clearTimeout(hoverTimer);
        setHoverTimer(
            setTimeout(() => {
                setShowProfilePreview(true);
            }, 300)
        );
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimer);
        setHoverTimer(
            setTimeout(() => {
                setShowProfilePreview(false);
            }, 300)
        );
    };

    if (loading) return <LoadingSpinner />;
    if (!post) return <div>Post not found.</div>;

    const { title, content, publishDate, views, user: author, categories } = post;
    const getReplies = (commentId) =>
        postComments.filter((reply) => reply.replyId === commentId);

    return (
        <div className="max-w-2xl mx-auto pt-16 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-4 mt-5">
                {author ? (
                    <div className="relative group"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link
                            to={`/user/${author?.id}`}
                            className="flex items-center w-full text-left"
                        >
                            <img
                                src={author.profilePicture}
                                alt={author.fullName}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                                <p className="text-sm font-medium">
                                    {author.fullName}
                                </p>
                                <p className="text-xs text-gray-400">
                                    @{author.login}
                                </p>
                            </div>
                        </Link>

                        {showProfilePreview && (
                            <div
                                className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2 transition-opacity duration-300 ease-in-out"
                                onMouseEnter={() => { setShowProfilePreview(true); }}
                                onMouseLeave={() => setShowProfilePreview(false)}
                            >
                                <ProfilePreview userId={author?.id} />
                            </div>
                        )}
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

                {user?.id === author?.id && (
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
                                setShowDeleteConfirm(true);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <div className='flex justify-between'>
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                <FavButton
                    favourited={favourited}
                    onClick={handleFav}
                />
            </div>
            <p className="text-gray-500 text-sm mb-2">
                Published on {new Date(publishDate).toLocaleDateString()} | Views: {views}
            </p>
            <div className="prose prose-lg break-words mb-4">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypePrism]} 
                >
                    {content}
                </ReactMarkdown>
            </div>

            <CategoryTags categories={categories} maxVisible={categories.length} />

            <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
                <div className="flex items-center gap-4">
                    <LikeButton
                        liked={liked}
                        onClick={handleLike}
                    />
                    <DislikeButton
                        disliked={disliked}
                        onClick={handleDislike}
                    />
                </div>
                <div className="flex gap-4">
                    <span>❤️ {likesCount}</span>
                    <span>👎 {dislikesCount}</span>
                </div>
            </div>

            <div className="my-8">
                <h3 className="text-xl font-semibold">Comments</h3>

                {(postComments.length > 0 || filterOption === 'inactive') && (
                    <div className="mt-2 mb-4 flex justify-between items-center">
                        {totalPages > 1 ? (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        ) : (<div></div>)}

                        <div className="flex space-x-4">
                            <SortDropdown
                                sortOption={sortOption}
                                onSortChange={handleSortChange}
                            />
                            <FilterDropdown
                                filterOption={filterOption}
                                onFilterChange={handleFilterChange}
                                isAuthor={user?.id === author?.id}
                            />
                        </div>
                    </div>
                )}

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
                    <p className='text-s mb-4'>No comments found, be first!</p>}
                {
                    postComments.length > 0 && (
                        <div className="flex justify-between items-center">
                            {totalPages > 1 ? (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => setCurrentPage(page)}
                                />) : (<div></div>)}
                        </div>
                    )
                }
                <h3 className="text-xl font-semibold">Add a Comment</h3>
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
                </ div>
            )}
        </div>
    );
}

export default FullPost;