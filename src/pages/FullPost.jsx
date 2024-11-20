import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostById, fetchPostComments, updatePostLike } from '../services/postService';
import Comment from '../components/Comment';
import CategoryTags from '../components/CategoryTags';
import LoadingSpinner from '../components/LoadingSpinner';
import LikeButton from '../components/LikeButton';
import DislikeButton from '../components/DislikeButton';
import { NotifyContext } from '../context/NotifyContext';
import died from '../assets/died.png';

function FullPost() {
    const { id } = useParams();
    const showNotification = useContext(NotifyContext);

    const [post, setPost] = useState(null);
    const [postComments, setPostComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFetchingLike, setIsFetchingLike] = useState(false);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const postData = await fetchPostById(id);
                const commentsData = await fetchPostComments(id);
                setPost(postData);
                setPostComments(commentsData);
            } catch (error) {
                console.error('Failed to load post:', error);
                showNotification('Failed to load post data.', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [id, showNotification]);

    const handleLike = async (type) => {
        if (isFetchingLike) return;
        setIsFetchingLike(true);

        try {
            const updatedLikes = await updatePostLike(id, type);
            setPost((prevPost) => ({
                ...prevPost,
                likes: updatedLikes,
            }));
        } catch (error) {
            console.error(`Failed to ${type} the post:`, error);
            showNotification(`Failed to ${type} the post.`, 'error');
        } finally {
            setIsFetchingLike(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!post) return <div>Post not found.</div>;

    const { title, content, publishDate, views, user, categories, likes } = post;

    const likesCount = likes.filter((like) => like.type === 'like').length;
    const dislikesCount = likes.filter((like) => like.type === 'dislike').length;

    const getReplies = (commentId) =>
        postComments.filter((reply) => reply.replyId === commentId);

    return (
        <div className="max-w-2xl mx-auto pt-16 flex flex-col flex-grow">
            {user ? (
                <div className="flex items-center mb-4 mt-5">
                    <img src={user.profilePicture} alt="Author" className="w-10 h-10 rounded-full mr-2" />
                    <h2 className="font-semibold text-lg">{user.fullName}</h2>
                </div>
            ) : (
                <div className="flex items-center mb-4 mt-5">
                    <img src={died} alt="Author" className="w-10 h-10 rounded-full mr-2" />
                    <h2 className="font-semibold text-lg">
                        <i>Deleted account</i>
                    </h2>
                </div>
            )}

            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="text-gray-500 text-sm mb-2">
                Published on {new Date(publishDate).toLocaleDateString()} | Views: {views}
            </p>
            <p className="text-gray-700 mb-4">{content}</p>
            <CategoryTags categories={categories} maxVisible={categories.length} />

            <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
                <div className="flex items-center gap-4">
                    <LikeButton
                        liked={false}
                        isFetching={isFetchingLike}
                        onClick={() => handleLike('like')}
                    />
                    <DislikeButton
                        liked={false}
                        isFetching={isFetchingLike}
                        onClick={() => handleLike('dislike')}
                    />
                </div>
                <div className="flex gap-4">
                    <span>❤️ {likesCount}</span>
                    <span>👎 {dislikesCount}</span>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                {postComments
                    .filter((comment) => !comment.replyId)
                    .map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            replies={getReplies(comment.id)}
                        />
                    ))}
            </div>
        </div>
    );
}

export default FullPost;
