// pages/FullPost.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../services/postService';

function FullPost() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const postData = await fetchPostById(id);
                setPost(postData);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load post:', error);
                setLoading(false);
            }
        };

        loadPost();
    }, [id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-700">{post.text}</p>
            <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
                <span>👍 {post.likes} лайков</span>
                <span>💬 {post.comments} комментариев</span>
            </div>
        </div>
    );
}

export default FullPost;
