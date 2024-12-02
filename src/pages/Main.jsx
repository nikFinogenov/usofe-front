

import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/postService';
import PostPreview from '../components/PostPreview';
import { Link, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function Main() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const { posts } = await fetchPosts(1); 
                setPosts(posts);
            } catch (error) {
                console.error('Failed to load posts:', error);
            }
            finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [location]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex flex-col items-center pt-16 min-h-screen">
            <div className="w-full bg-blue-600 text-white p-8 text-center mb-6 hidden sm:block">
                <h1 className="text-4xl font-bold sm:text-3xl text-center">Welcome to the Muffin Forum!</h1>
                <p className="text-lg mt-2 sm:text-base">Explore the latest discussions and trending topics</p>
            </div>

            {posts.length > 0 && (
                <div className="w-full max-w-5xl mb-6 p-4 bg-white rounded-lg shadow-lg sm:w-full sm:px-4">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2 mt-5 sm:mt-5">Featured Post</h2>
                    <Link to={`/post/${posts[0].id}`}>
                        <PostPreview post={posts[0]} className="text-xl" />
                    </Link>
                </div>
            )}


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 max-w-5xl w-full mb-10">
                {posts.slice(1, 7).map((post) => (
                    <Link key={post.id} to={`/post/${post.id}`} className="hover:shadow-xl transition-shadow duration-300">
                        <PostPreview post={post} />
                    </Link>
                ))}
            </div>
        </div>

    );
}

export default Main;
