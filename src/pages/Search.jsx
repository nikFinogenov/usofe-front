import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { search } from '../services/searchService'; // Ensure this service is set up correctly
import SpinnerIcon from '../components/SpinnerIcon'; // Import the SpinnerIcon component
import { NotifyContext } from '../context/NotifyContext';
import SearchResult from '../components/SearchResult'; // Importing SearchResult component

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState({ users: [], categories: [], posts: [] });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreResults, setHasMoreResults] = useState(true);
    const showNotification = useContext(NotifyContext);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const response = await search(query, currentPage);
                console.log(response);
                
                if (response.users.length === 0 && response.categories.length === 0 && response.posts.length === 0) {
                    setHasMoreResults(false);
                } else {
                    setResults(prevResults => ({
                        users: [...prevResults.users, ...response.users],
                        categories: [...prevResults.categories, ...response.categories],
                        posts: [...prevResults.posts, ...response.posts],
                    }));
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
    }, [query, currentPage, showNotification]);

    useEffect(() => {
        const handleScroll = () => {
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

    return (
        <div className="p-6 max-w-4xl mx-auto pt-16">
            <h1 className="text-3xl font-bold mb-4 mt-5">Search Results</h1>

            {!loading && isEmptyResults && (
                <p className="text-gray-500 text-xl"><i>No results found.</i>😢</p>
            )}

            {/* Render the search results */}
            <div>
                <SearchResult title="Users" data={results.users} linkPrefix="/user" />
                <SearchResult title="Posts" data={results.posts} linkPrefix="/post" />
                <SearchResult title="Categories" data={results.categories} linkPrefix="/categories" />
            </div>

            {/* Show the spinner only if there are more results to load */}
            {loading && (
                <div className="flex justify-center mt-6">
                    <SpinnerIcon />
                </div>
            )}
        </div>
    );
};

export default Search;
