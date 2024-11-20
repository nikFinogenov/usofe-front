import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostById, fetchPostComments, updatePostLike, deletePostLike } from '../services/postService';
import Comment from '../components/Comment';
import CategoryTags from '../components/CategoryTags';
import LoadingSpinner from '../components/LoadingSpinner';
import LikeButton from '../components/LikeButton';
import DislikeButton from '../components/DislikeButton';
import { NotifyContext } from '../context/NotifyContext';
import died from '../assets/died.png';
import { AuthContext } from '../context/AuthContext';

function FullPost() {
    const { id } = useParams();
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

    useEffect(() => {
        const loadPost = async () => {
            try {
                const postData = await fetchPostById(id);
                const commentsData = await fetchPostComments(id);
                setPost(postData);
                setPostComments(commentsData);

                // Подсчет лайков и дизлайков
                const likes = postData.likes || [];
                setLikesCount(likes.filter((like) => like.type === 'like').length);
                setDislikesCount(likes.filter((like) => like.type === 'dislike').length);
                // console.log(postData);

                // Проверка, был ли пост лайкнут или дизлайкнут
                const userLike = likes.find((like) => like.userId === user.id);  // Пример: проверка по userId
                console.log(userLike);
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

    if (loading) return <LoadingSpinner />;
    if (!post) return <div>Post not found.</div>;

    const { title, content, publishDate, views, user:author, categories } = post;

    const getReplies = (commentId) =>
        postComments.filter((reply) => reply.replyId === commentId);

    return (
        <div className="max-w-2xl mx-auto pt-16 flex flex-col flex-grow">
            {author ? (
                <div className="flex items-center mb-4 mt-5">
                    <img src={author.profilePicture} alt="Author" className="w-10 h-10 rounded-full mr-2" />
                    <h2 className="font-semibold text-lg">{author.fullName}</h2>
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
