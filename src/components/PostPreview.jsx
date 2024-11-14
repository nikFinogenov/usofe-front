import React from 'react';
import CategoryTags from './CategoryTags';
import died from '../assets/died.png'

function PostPreview({ post }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>

            <p className="text-gray-700 mb-4">
                {post.content.length > 50 ? `${post.content.slice(0, 50)}...` : post.content}
            </p>

            <CategoryTags categories={post.categories} maxVisible={5} />

            <div className="flex justify-between items-center text-gray-500 text-sm my-4 border-t border-gray-200 pt-4">
                <div className="flex flex-col items-start">
                    <span className='mb-5'>❤️ Likes: {post.likeCount}</span>
                    <span>👎 Dislikes: {post.dislikeCount}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className='mb-5'>👀 Views: {post.views}</span>
                    <span>💬 Comments: {post.commentCount}</span>
                </div>
            </div>

            <div className="mt-auto flex items-center pt-4 border-t border-gray-200">
                {post.user ? (
                    <>
                        <img
                            src={post.user.profilePicture}
                            alt={post.user.fullName}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <p className="text-sm font-medium">{post.user.fullName}</p>
                            <p className="text-xs text-gray-400">@{post.user.login}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <img
                            src={died}
                            alt="Deleted account"
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <p className="text-sm font-medium"><i>Deleted account</i></p>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
}

export default PostPreview;
