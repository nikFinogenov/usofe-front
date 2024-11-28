import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { search } from '../services/searchService'; // Assuming this service is set up correctly
import LoadingSpinner from '../components/LoadingSpinner';
import { NotifyContext } from '../context/NotifyContext';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q'); // Get the query string from the URL
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const showNotification = useContext(NotifyContext);
    // const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const response = await search(query); // Calling the search service with the query
                setResults(response);
            } catch (err) {
                showNotification("Failed to search", "error");
                // setError('Failed to fetch search results.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults(); // Only fetch if there's a query parameter
        }
    }, [query, showNotification]);

    return (
        <div className="p-6 max-w-4xl mx-auto pt-16">
            <h1 className="text-2xl font-bold mb-4 mt-5">Search Results</h1>

            {loading && <LoadingSpinner />} {/* Show loading spinner while data is fetching */}
            {/* {error && <p className="text-red-500">{error}</p>} Show error message if something goes wrong */}

            {results && !loading && (
                <div>
                    {/* Users results */}
                    {results.users?.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Users</h2>
                            <ul>
                                {results.users.map((user) => (
                                    <li key={user.id} className="py-2 border-b">   
                                        <a href={`/user/${user.id}`} className="text-blue-500 hover:underline">
                                            @{user.login} — {user.fullName}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Categories results */}
                    {results.categories?.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Categories</h2>
                            <ul>
                                {results.categories.map((category) => (
                                    <li key={category.id} className="py-2 border-b">
                                        <a href={`/categories/${category.id}/posts`} className="text-blue-500 hover:underline">
                                            {category.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Posts results */}
                    {results.posts?.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Posts</h2>
                            <ul>
                                {results.posts.map((post) => (
                                    <li key={post.id} className="py-2 border-b">
                                        <a href={`/post/${post.id}`} className="text-blue-500 hover:underline">
                                            {post.title.length > 100 ? post.title.slice(0, 100)+"..." : post.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* No results message */}
                    {!results.users?.length && !results.categories?.length && !results.posts?.length && (
                        <p>No results found for "<strong>{query}</strong>".</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
