// pages/FullPost.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function FullPost() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const response = await axios.get(`http://localhost:3306/api/posts/${id}`);
                setPost(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load post:', error);
                setLoading(false);
            }
        };

        loadPost();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!post) return <div>Post not found.</div>;

    return (
        <div className="max-w-2xl mx-auto pt-16 flex flex-col min-h-screen">
            <br />
            <div className="flex items-center mb-4">
                <img src={post.user.profilePicture} alt="Author" className="w-10 h-10 rounded-full mr-2" />
                <h2 className="font-semibold text-lg">{post.user.fullName}</h2>
            </div>
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-500 text-sm mb-2">
                Published on {new Date(post.publishDate).toLocaleDateString()} | Views: {post.views}
            </p>
            <p className="text-gray-700 mb-4">{post.content}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map(category => (
                    <span key={category.id} className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {category.title}
                    </span>
                ))}
            </div>
            
            <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
                <span>👍 {post.likes.length} likes</span>
                <span>💬 {post.comments.length} comments</span>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                {post.comments.map(comment => (
                    <div key={comment.id} className="mb-4 border-b pb-4">
                        <p className="text-gray-700">{comment.content}</p>
                        <div className="flex justify-between items-center mt-2 text-gray-500 text-sm">
                            <span>👍 {comment.likes.filter(like => like.type === 'like').length} likes</span>
                            <span>👎 {comment.likes.filter(like => like.type === 'dislike').length} dislikes</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FullPost;
