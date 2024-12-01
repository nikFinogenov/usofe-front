import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryTags from './CategoryTags';
import ProfilePreview from './ProfilePreview';
import died from '../assets/died.png';

function stripMarkdown(content) {
    return content.replace(/[#_*~`>|-]/g, '').replace(/\[.*?\]\(.*?\)/g, '').trim();
}

function PostPreview({ post }) {
    const [showProfilePreview, setShowProfilePreview] = useState(false);
    const [hoverTimer, setHoverTimer] = useState(null);

    const previewContent =
        stripMarkdown(post.content).slice(0, 50) +
        (post.content.length > 50 ? '...' : '');

    const handleMouseEnter = () => {
        clearTimeout(hoverTimer); // Очистить таймер, если он был запущен
        setHoverTimer(
            setTimeout(() => {
                setShowProfilePreview(true);
            }, 300) // Задержка перед показом превью
        );
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimer); // Очистить таймер, если он был запущен
        setHoverTimer(
            setTimeout(() => {
                setShowProfilePreview(false);
            }, 300) // Задержка перед скрытием превью
        );
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-md p-6 mt-4 flex flex-col h-full relative `}
        >
            {post.status === 'inactive' && (
                <p>
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                        Inactive
                    </span>
                </p>
            )}


            <div className='flex justify-between'>
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <Link to={`/date/${new Date(post.createdAt).toLocaleDateString('en-CA')}/posts`}>
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                        {new Date(post.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                        })}
                    </span>
                </Link>
            </div>
            <p className="text-gray-700 mb-4">{previewContent}</p>
            <CategoryTags categories={post.categories} maxVisible={5} />
            <div className="flex justify-between items-center text-gray-500 text-sm my-4 border-t border-gray-200 pt-4">
                <div className="flex flex-col items-start">
                    <span className="mb-5">❤️ Likes: {post.likeCount}</span>
                    <span>👎 Dislikes: {post.dislikeCount}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="mb-5">👀 Views: {post.views}</span>
                    <span>💬 Comments: {post.commentCount}</span>
                </div>
            </div>

            {post.user ? (
                <div
                    className="mt-auto flex items-center pt-4 border-t border-gray-200 relative group"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link
                        to={`/user/${post.user.id}`}
                        className="flex items-center w-full text-left"
                    >
                        <img
                            src={post.user.profilePicture}
                            alt={post.user.fullName}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <p className="text-sm font-medium">
                                {post.user.fullName}
                            </p>
                            <p className="text-xs text-gray-400">
                                @{post.user.login}
                            </p>
                        </div>
                    </Link>

                    {showProfilePreview && (
                        <div
                            className="absolute top-full left-0 mt-2 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-2 transition-opacity duration-300 ease-in-out"
                            onMouseEnter={handleMouseEnter} // Удерживаем превью, если на него наведён курсор
                            onMouseLeave={handleMouseLeave} // Скрываем превью с задержкой
                        >
                            <ProfilePreview userId={post.user.id} />
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-auto flex items-center pt-4 border-t border-gray-200 relative group">
                    <img
                        src={died}
                        alt="Deleted account"
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                        <p className="text-sm font-medium">
                            <i>Deleted account</i>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostPreview;
