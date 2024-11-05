// pages/PostsByCategory.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostsByCategoryId } from '../services/categoryService';

function PostsByCategory() {
    const { category_id } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const postsData = await fetchPostsByCategoryId(category_id);
                setPosts(postsData);
            } catch (error) {
                console.error('Failed to load posts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [category_id]);

    if (loading) return <div>Loading posts...</div>;
    if (!posts.length) return <div>No posts found for this category.</div>;

    return (
        <div className="max-w-2xl mx-auto pt-16 mt-5 mb-5">
            <h1 className="text-2xl font-bold mb-4">Posts in Category</h1>
            <ul className="space-y-4">
                {posts.map(post => (
                    <li key={post.id} className="border p-4 rounded">
                        <h2 className="font-semibold">{post.title}</h2>
                        <p>{post.content}</p>
                        <span className="text-gray-500">Published on {new Date(post.publishDate).toLocaleDateString()}</span>
                    </li>
                    
                ))}
            </ul>
        </div>
    );
}

export default PostsByCategory;
