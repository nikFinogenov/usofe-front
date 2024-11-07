// pages/FullPost.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../services/postService';
import Comment from '../components/Comment';
// import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

function FullPost() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    // const renderRating = (rating) => {
    //     if (rating > 0) {
    //         return <FaArrowUp className="text-green-500" />;
    //     } else if (rating < 0) {
    //         return <FaArrowDown className="text-red-500" />;
    //     } else {
    //         return <FaMinus className="text-gray-500" />;
    //     }
    // };

    useEffect(() => {
        const loadPost = async () => {
            try {
                const postData = await fetchPostById(id);
                setPost(postData);
            } catch (error) {
                console.error('Failed to load post:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!post) return <div>PostPreview not found.</div>;

    const { title, content, publishDate, views, user, categories, comments, likes } = post;

    // Разделяем лайки и дизлайки поста
    const likesCount = likes.filter(like => like.type === 'like').length;
    const dislikesCount = likes.filter(like => like.type === 'dislike').length;

    return (
        <div className="max-w-2xl mx-auto pt-16 flex flex-col min-h-screen mt-5">
            <div className="flex items-center mb-4">
                {/* <div className="flex items-center mr-3">
                    <span className="text-gray-600 text-sm font-bold mr-1">{user.rating}</span>
                    {renderRating(user.rating)}
                </div> */}
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
                <span>💬 {comments.length} comments</span>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                {comments.map(comment => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
}

export default FullPost;
