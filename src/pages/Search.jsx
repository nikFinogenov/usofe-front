import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { search } from '../services/searchService'; // Предполагается, что этот сервис настроен правильно
import LoadingSpinner from '../components/LoadingSpinner';
import { NotifyContext } from '../context/NotifyContext';
import SearchResult from '../components/SearchResult'; // Импортируем компонент SearchResult

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q'); // Получаем строку запроса из URL
    const [results, setResults] = useState({ users: [], categories: [], posts: [] });
    const [loading, setLoading] = useState(true);
    const showNotification = useContext(NotifyContext);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                const response = await search(query); // Вызываем сервис поиска с запросом
                console.log(response);
                setResults(response); // Сохраняем результаты поиска
            } catch (err) {
                showNotification("Failed to search", "error");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults(); // Только если есть параметр запроса
        }
    }, [query, showNotification]);

    const isEmptyResults =
        !loading &&
        (!results.users.length &&
            !results.categories.length &&
            !results.posts.length);

    return (
        <div className="p-6 max-w-4xl mx-auto pt-16">
            <h1 className="text-3xl font-bold mb-4 mt-5">Search Results</h1>

            {loading && <LoadingSpinner />}

            {!loading && (
                isEmptyResults ? (
                    <p className="text-gray-500 text-xl"><i>No results found.</i>😢</p>
                ) : (
                    <div>
                        <SearchResult title="Users" data={results.users} linkPrefix="/user" />
                        <SearchResult title="Posts" data={results.posts} linkPrefix="/post" />
                        <SearchResult title="Categories" data={results.categories} linkPrefix="/categories" />
                    </div>
                )
            )}
        </div>
    );
};

export default Search;
