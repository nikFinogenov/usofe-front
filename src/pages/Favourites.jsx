import React, { useEffect, useState } from 'react';
import PostPreview from '../components/PostPreview';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchFavourites } from '../services/userService';

function Favourites() {
    const postsPerPage = 12;
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalFavourites, setTotalFavourites] = useState(0);

    useEffect(() => {
        const loadFavourites = async () => {
            try {
                const { favourites, totalFavourites } = await fetchFavourites(currentPage, postsPerPage);
                setFavourites(favourites);
                setTotalFavourites(totalFavourites);
            } catch (error) {
                console.error('Failed to load favourites:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFavourites();
        console.log(favourites);
    }, [currentPage, favourites]);

    const totalPages = Math.ceil(totalFavourites / postsPerPage);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex flex-col items-center pt-16 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-semibold text-gray-800 mt-4 text-left w-full max-w-5xl px-4">Favourites</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-5xl w-full mb-5">
                {favourites.map(fav =>
                (
                    <Link key={fav.id} to={`/post/${fav.Post.id}`} className="hover:shadow-2xl transition-shadow duration-300">
                        <PostPreview post={fav.Post} />
                    </Link>
                )
                )}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
}

export default Favourites;
