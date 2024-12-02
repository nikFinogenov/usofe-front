// src/pages/NewPost.jsx
import React, { useState, useEffect, useContext } from 'react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useNavigate } from 'react-router-dom';
// import MarkdownIt from 'markdown-it';
import { NotifyContext } from '../context/NotifyContext'; // Уведомления
import { fetchCategoriesTags } from '../services/categoryService'; // Сервис для запросов
import { createPost } from '../services/postService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypePrism from 'rehype-prism-plus';
import 'prismjs/themes/prism-tomorrow.css';

// Инициализация Markdown-it
// const mdParser = new MarkdownIt(
//     {
//         breaks: true, // Включает поддержку переносов строк
//         gfm: true
//     }
// );

const NewPost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState([]); // Выбранные теги
    const [search, setSearch] = useState(''); // Поиск по тегам
    const [availableTags, setAvailableTags] = useState([]); // Доступные теги
    const showNotification = useContext(NotifyContext);

    useEffect(() => {
        // Получение списка тегов
        const fetchTags = async () => {
            try {
                const response = await fetchCategoriesTags();
                setAvailableTags(response.categories);
            } catch (error) {
                showNotification('Failed to load tags.', 'error');
            }
        };
        fetchTags();
    }, [showNotification]);
    const renderMarkdownPreview = (text) => {
        return (
            <div className="prose break-words">
                <ReactMarkdown
                    children={text}
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[
                        [
                            rehypePrism,
                            {
                                ignoreMissing: true, // Игнорируем неизвестные языки
                                defaultLanguage: 'plaintext', // Язык по умолчанию
                            },
                        ],
                    ]}
                />
            </div>
        );
    };

    // useEffect для поиска элементов <pre> и добавления класса, если его нет
    useEffect(() => {
        // Находим все элементы <pre> на странице
        const preElements = document.querySelectorAll('pre');
        
        preElements.forEach((pre) => {
            // Если у элемента нет классов, добавляем language-plaintext
            if (!pre.classList.length) {
                pre.classList.add('language-plaintext');
            }
        });
    }, [body]); 

    const handleEditorChange = ({ text }) => {
        setBody(text);
    };

    const handleAddTag = (tag) => {
        if (tags.find((t) => t.id === tag.id)) {
            showNotification('Tag already selected.', 'warning');
            return;
        }
        setTags([...tags, tag]);
        setSearch(''); // Очистка поиска
    };

    const handleRemoveTag = (id) => {
        setTags(tags.filter((tag) => tag.id !== id));
    };

    const handlePublish = async () => {
        if (title.trim() && body.trim() && tags.length > 0) {
            try {
                // const payload = {
                //     title,
                //     content: body,
                //     tags: tags.map((tag) => tag.id),
                // };
                await createPost(title, body, tags.map((tag) => tag.id))
                // console.log(payload); // Здесь отправка на сервер
                showNotification('Post published successfully!', 'success');
                setTitle('');
                setBody('');
                setTags([]);
                navigate('/');
            } catch (error) {
                showNotification('Failed to publish post.', 'error');
            }
        } else {
            showNotification('Please fill out all fields.', 'warning');
        }
    };

    return (
        <div className="max-w-3xl mx-auto pt-16 pb-4 mbl:px-4 tbl:px-4 2tbl:px-4">
            <h1 className="text-3xl font-bold mb-6 mt-5">Create a New Post</h1>

            {/* Поле для названия */}
            <div className="mb-4">
                <label className="block text-2xl font-semibold mb-2" htmlFor="title">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter the title"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>

            {/* Поле для тегов */}
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Tags</label>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tags..."
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {search && (
                    <ul className="border rounded bg-white mt-2 shadow">
                        {availableTags
                            .filter((tag) =>
                                tag.title.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((tag) => (
                                <li
                                    key={tag.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                                    onClick={() => handleAddTag(tag)}
                                >
                                    {tag.title}
                                </li>
                            ))}
                    </ul>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="px-2 py-1 bg-blue-200 text-blue-800 rounded flex items-center"
                        >
                            {tag.title}
                            <button
                                className="ml-2 text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveTag(tag.id)}
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Редактор Markdown */}
            <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">
                    Body
                </label>
                <MarkdownEditor
                    value={body}
                    style={{ height: '500px' }}
                    renderHTML={(text) => renderMarkdownPreview(text)}
                    onChange={handleEditorChange}
                    placeholder="Write your post here..."
                />
            </div>

            {/* Кнопка Publish */}
            <button
                onClick={handlePublish}
                className={`w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition ${!title || !body || tags.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                disabled={!title || !body || tags.length === 0}
            >
                Publish
            </button>
        </div>
    );
};

export default NewPost;
