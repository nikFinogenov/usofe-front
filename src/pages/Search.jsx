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
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreResults, setHasMoreResults] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false); // State to control "Back to Top" button visibility
    const showNotification = useContext(NotifyContext);

    useEffect(() => {
        // Reset results and current page on new query
        setResults({ users: [], categories: [], posts: [] });
        setCurrentPage(1);
        setHasMoreResults(true); // Reset the "has more results" state
    }, [query]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const response = await search(query, currentPage);
                // console.log(results.users.length + results.categories.length + results.posts.length);
                // console.log(response.totalResults);
                if (results.users.length + results.categories.length + results.posts.length === response.totalResults) {
                    setHasMoreResults(false);
                } else {
                    // Update results safely using the functional form of setState
                    setResults(prevResults => ({
                        users: prevResults.users.length === 0 ? [...prevResults.users, ...response.users] : prevResults.users,
                        categories: prevResults.categories.length === 0 ? [...prevResults.categories, ...response.categories] : prevResults.categories,
                        posts: [...prevResults.posts, ...response.posts],
                    }));
                    setTotalResults(response.totalResults); // Update total results
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
            // Show the "Back to Top" button when the user scrolls down
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }

            // Load more results if the user scrolls near the bottom
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

    // Calculate the total number of results
    // const totalResults = results.totalResults;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto pt-16">
            <h1 className="text-3xl font-bold mb-4 mt-5">Search Results</h1>

            {/* Show total results */}
            {!loading && totalResults > 0 && (
                <p className="text-gray-500 text-lg mb-4">{`Found ${totalResults} result${totalResults > 1 ? 's' : ''}`}</p>
            )}

            {/* Show no results message */}
            {!loading && isEmptyResults && (
                <p className="text-gray-500 text-xl"><i>No results found.</i>😢</p>
            )}

            {/* Render the search results */}
            <div>
                <SearchResult title="Users" data={results.users} linkPrefix="/user" />
                <SearchResult title="Categories" data={results.categories} linkPrefix="/categories" />
                <SearchResult title="Posts" data={results.posts} linkPrefix="/post" />
            </div>

            {/* Show the spinner only if there are more results to load */}
            {loading && (
                <div className="flex justify-center mt-6">
                    <SpinnerIcon />
                </div>
            )}

            {/* "Back to Top" Button */}
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
