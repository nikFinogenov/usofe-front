// src/pages/Main.jsx

import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/postService';
import Post from '../components/Post';
import { Link, useLocation } from 'react-router-dom';

function Main() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const { posts } = await fetchPosts(1); // Fetch only the first page for main
                setPosts(posts);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load posts:', error);
                setLoading(false);
            }
        };

        loadPosts();
    }, [location]);

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    return (
        <div className="flex flex-col items-center pt-16 bg-gray-100 min-h-screen">
            {/* Banner Section */}
            <div className="w-full bg-blue-600 text-white p-8 text-center mb-6">
                <h1 className="text-4xl font-bold">Welcome to Our Forum</h1>
                <p className="text-lg mt-2">Explore the latest discussions and trending topics</p>
            </div>

            {/* Featured Post */}
            {posts.length > 0 && (
                <div className="w-full max-w-5xl mb-6 p-4 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Featured Post</h2>
                    <Link to={`/post/${posts[0].id}`}>
                        <Post post={posts[0]} className="text-xl" />
                    </Link>
                </div>
            )}

            {/* Grid of Remaining Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-5xl w-full mb-10">
                {posts.slice(1, 7).map((post) => (
                    <Link key={post.id} to={`/post/${post.id}`} className="hover:shadow-xl transition-shadow duration-300">
                        <Post post={post} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Main;
