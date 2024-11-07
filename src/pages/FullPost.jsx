// pages/FullPost.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostById, fetchPostComments } from '../services/postService';
import Comment from '../components/Comment';

function FullPost() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [postComments, setPostComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const postData = await fetchPostById(id);
                const commentsData = await fetchPostComments(id);
                setPost(postData);
                setPostComments(commentsData);
            } catch (error) {
                console.error('Failed to load post:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!post) return <div>Post not found.</div>;

    const { title, content, publishDate, views, user, categories, likes } = post;

    const likesCount = likes.filter(like => like.type === 'like').length;
    const dislikesCount = likes.filter(like => like.type === 'dislike').length;

    const getReplies = (commentId) =>
        postComments.filter(reply => reply.replyId === commentId);

    return (
        <div className="max-w-2xl mx-auto pt-16 flex flex-col min-h-screen mt-5">
            <div className="flex items-center mb-4">
                <img src={user.profilePicture} alt="Author" className="w-10 h-10 rounded-full mr-2" />
                <h2 className="font-semibold text-lg">{user.fullName}</h2>
            </div>
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="text-gray-500 text-sm mb-2">
                Published on {new Date(publishDate).toLocaleDateString()} | Views: {views}
            </p>
            <p className="text-gray-700 mb-4">{content}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(category => (
                    <span key={category.id} className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {category.title}
                    </span>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
                <span>❤️ {likesCount} likes</span>
                <span>👎 {dislikesCount} dislikes</span>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                {postComments
                    .filter(comment => !comment.replyId)
                    .map(comment => (
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
