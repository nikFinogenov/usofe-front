import React, { useEffect, useState, useContext } from 'react';
import { fetchPosts } from '../services/postService';
import PostPreview from '../components/PostPreview';
import Pagination from '../components/Pagination';
import { Link, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import SortDropdown from '../components/SortDropdown';  
import FilterDropdown from '../components/FilterDropdown';  
import { AuthContext } from '../context/AuthContext';

function Posts() {
    const postsPerPage = 12;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [sortOption, setSortOption] = useState(sessionStorage.getItem('sortOptionPost') || 'newest'); 
    const [filterOption, setFilterOption] = useState(sessionStorage.getItem('filterOptionPost') || 'all'); 
    const { user } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const page = query.get('page');
        if (page) setCurrentPage(parseInt(page));
    }, [location.search]);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const way = (sortOption === 'newest' || sortOption === 'most' || sortOption === 'popular') ? 'desc' : 'asc';
                const { posts, totalPosts } = await fetchPosts(currentPage, postsPerPage, sortOption, way, filterOption); 
                setPosts(posts);
                
                setTotalPosts(totalPosts);
            } catch (error) {
                console.error('Failed to load posts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [currentPage, sortOption, filterOption]); 

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        sessionStorage.setItem('sortOptionPost', event.target.value); 
    };

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
        sessionStorage.setItem('filterOptionPost', event.target.value)
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex flex-col items-center pt-16 bg-gray-100 min-h-screen">
            <div className="flex items-center justify-between w-full max-w-5xl px-4 mt-4">
                <h2 className="text-3xl font-semibold text-gray-800">Posts</h2>
                <div className="flex items-center gap-4">
                    <SortDropdown sortOption={sortOption} onSortChange={handleSortChange} type={"post"} />
                    <FilterDropdown filterOption={filterOption} onFilterChange={handleFilterChange} isAuthor={user?.role === 'admin'} />
                </div>
            </div>


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