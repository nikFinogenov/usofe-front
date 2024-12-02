import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchPostsByCategoryId } from '../services/categoryService';
import PostPreview from '../components/PostPreview';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function Category() {
    const { id } = useParams();
    const postsPerPage = 12;
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
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
                const { title, posts, desc, totalPosts } = await fetchPostsByCategoryId(id, currentPage, postsPerPage);
                setPosts(posts);
                setTitle(title);
                setDescription(desc);
                setTotalPosts(totalPosts);
            } catch (error) {
                console.error('Failed to load posts:', error);
            }
            finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [id, currentPage]);

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex flex-col items-center pt-16 bg-gray-100 min-h-screen mt-5 mbl:px-4 tbl:px-4 2tbl:px-4">
            <h1 className="text-2xl font-bold mb-2">Posts about <i>{title}</i> </h1>
            <h3 className="text-m mb-4">{description ? description : "No description available."}</h3>

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

export default Category;
