import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/postService';
import PostPreview from '../components/PostPreview';
import Pagination from '../components/Pagination';
import { Link, useLocation } from 'react-router-dom';

function Posts() {
    const postsPerPage = 12;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const page = query.get('page');
        if (page) setCurrentPage(parseInt(page));
    }, [location.search]);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const { posts, totalPosts } = await fetchPosts(currentPage, postsPerPage);
                setPosts(posts);
                setTotalPosts(totalPosts);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load posts:', error);
                setLoading(false);
            }
        };

        loadPosts();
    }, [currentPage]);

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    return (
        <div className="flex flex-col items-center pt-16 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-semibold text-gray-800 mt-4 text-left w-full max-w-5xl px-4">Posts</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-5xl w-full mb-5">
                {posts.map(post => (
                    <Link key={post.id} to={`/post/${post.id}`} className="hover:shadow-2xl transition-shadow duration-300">
                        <PostPreview post={post} />
                    </Link>
                ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
}

export default Posts;
