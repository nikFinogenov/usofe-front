import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, updatePost } from '../services/postService';
import { NotifyContext } from '../context/NotifyContext';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { fetchCategoriesTags } from '../services/categoryService'; // Service for fetching categories
import MarkdownIt from 'markdown-it'; // Markdown parser
import died from '../assets/died.png';

// Initialize the Markdown parser
const mdParser = new MarkdownIt();

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const showNotification = useContext(NotifyContext);
    const { user } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]); // Tags for the post
    const [availableTags, setAvailableTags] = useState([]); // Available tags to choose from
    const [search, setSearch] = useState(''); // Search term for tags
    const [loading, setLoading] = useState(true);

    // Fetch post and tags data
    useEffect(() => {
        const loadPostAndTags = async () => {
            try {
                const postData = await fetchPostById(id);
                setPost(postData);
                setTitle(postData.title);
                setContent(postData.content); // Initially set content as markdown
                setTags(postData.categories || []);
                
                const response = await fetchCategoriesTags();
                setAvailableTags(response.categories);
            } catch (error) {
                console.error('Failed to load post or tags:', error);
                showNotification('Failed to load post or tags.', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadPostAndTags();
    }, [id, showNotification]);

    const handleEditorChange = ({ text }) => {
        setContent(text);
    };

    const handleAddTag = (tag) => {
        if (tags.find((t) => t.id === tag.id)) {
            showNotification('Tag already selected.', 'warning');
            return;
        }
        setTags([...tags, tag]);
        setSearch(''); // Clear search when tag is added
    };

    const handleRemoveTag = (id) => {
        setTags(tags.filter((tag) => tag.id !== id));
    };

    const handleUpdatePost = async () => {
        try {
            await updatePost(id, title, content, tags.map((tag) => tag.id));
            showNotification('Post updated successfully!', 'success');
            navigate(`/post/${id}`);
        } catch (error) {
            showNotification('Failed to update post.', 'error');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!post) return <div>Post not found.</div>;

    return (
        <div className="max-w-2xl mx-auto pt-16 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-4 mt-5">
                <div className="flex items-center">
                    {post.user ? (
                        <>
                            <img
                                src={post.user.profilePicture}
                                alt="Author"
                                className="w-10 h-10 rounded-full mr-2"
                            />
                            <h2 className="font-semibold text-lg">{post.user.fullName}</h2>
                        </>
                    ) : (
                        <div className="flex items-center">
                            <img
                                src={died}
                                alt="Author"
                                className="w-10 h-10 rounded-full mr-2"
                            />
                            <h2 className="font-semibold text-lg">
                                <i>Deleted account</i>
                            </h2>
                        </div>
                    )}
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
            </div>

            {/* Tags input */}
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
            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <MarkdownEditor
                    value={content}
                    style={{ height: '500px' }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                    placeholder="Write your post content in markdown..."
                />
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    onClick={() => navigate(`/post/${id}`)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={handleUpdatePost}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition"
                >
                    Update Post
                </button>
            </div>
        </div>
    );
}

export default EditPost;
