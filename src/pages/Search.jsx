import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { search } from '../services/searchService';
import SpinnerIcon from '../components/SpinnerIcon';
import { NotifyContext } from '../context/NotifyContext';
import SearchResult from '../components/SearchResult';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState({ users: [], categories: [], posts: [] });
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreResults, setHasMoreResults] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const showNotification = useContext(NotifyContext);

    useEffect(() => {
        setResults({ users: [], categories: [], posts: [] });
        setCurrentPage(1);
        setHasMoreResults(true);
    }, [query]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const response = await search(query, currentPage);

                if (results.users.length + results.categories.length + results.posts.length === response.totalResults) {
                    setHasMoreResults(false);
                } else {
                    setResults(prevResults => ({
                        users: prevResults.users.length === 0 ? [...prevResults.users, ...response.users] : prevResults.users,
                        categories: prevResults.categories.length === 0 ? [...prevResults.categories, ...response.categories] : prevResults.categories,
                        posts: [...prevResults.posts, ...response.posts],
                    }));
                    setTotalResults(response.totalResults);
                }
            } catch (err) {
                showNotification("Failed to search", "error");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    // eslint-disable-next-line
    }, [query, currentPage, showNotification]); 

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }

            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && hasMoreResults && !loading) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hasMoreResults, loading]);

    const isEmptyResults = !loading && (!results.users.length && !results.categories.length && !results.posts.length);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto pt-16">
            <h1 className="text-3xl font-bold mb-4 mt-5">Search Results</h1>

            {!loading && totalResults > 0 && (
                <p className="text-gray-500 text-lg mb-4">{`Found ${totalResults} result${totalResults > 1 ? 's' : ''}`}</p>
            )}

            {!loading && isEmptyResults && (
                <p className="text-gray-500 text-xl"><i>No results found.</i>😢</p>
            )}

            <div>
                <SearchResult title="Users" data={results.users} linkPrefix="/user" />
                <SearchResult title="Categories" data={results.categories} linkPrefix="/categories" />
                <SearchResult title="Posts" data={results.posts} linkPrefix="/post" />
            </div>

            {loading && (
                <div className="flex justify-center mt-6">
                    <SpinnerIcon />
                </div>
            )}

            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
                >
                    ↑
                </button>
            )}
        </div>
    );
};

export default Search;
