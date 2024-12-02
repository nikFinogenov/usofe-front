import React, { useEffect, useState } from 'react';
import { fetchUserStats } from '../services/userService';
import SpinnerIcon from '../components/SpinnerIcon';

const ProfilePreview = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        const data = await fetchUserStats(userId);
        setUserData(data);
      } catch (error) {
        console.error('Failed to load user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserStats();
  }, [userId]);

  if (loading) {
    return <SpinnerIcon />;
  }

  if (!userData) {
    return <div className="text-gray-600 text-sm">User not found</div>;
  }

  const { user, stats } = userData;

  
  const truncateComment = (comment, maxLength = 20) => {
    
    const plainText = comment.replace(/[#_*~`>|-]/g, '').replace(/\[.*?\]\(.*?\)/g, '').trim();
  
    
    if (plainText.length > maxLength) {
      return plainText.slice(0, maxLength) + '...';
    }
    return plainText;
  };

  return (
    <div className="w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 transform transition duration-300 hover:scale-105">
      <div className="flex items-center mb-4">
        <img
          src={user.profilePicture}
          alt={user.login}
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold">{user.fullName}</h3>
          <p className="text-sm text-gray-600">@{user.login}</p>
        </div>
      </div>

      <ul className="space-y-2 text-sm">
        <li>
          <span className="font-semibold">Role:</span> {user.role}
        </li>
        <li>
          <span className="font-semibold">Rating:</span> {user.rating}
        </li>
        <li>
          <span className="font-semibold">Posts:</span> {stats.totalPosts}
        </li>
        <li>
          <span className="font-semibold">Account age:</span> {stats.accountAge} days
        </li>
        {stats.lastComment ? (
          <li className="border-t border-gray-300 pt-2">
            <span className="font-semibold">Last comment:</span> 
            <p className="text-gray-600 italic">
              "{truncateComment(stats.lastComment.content)}"
            </p>
          </li>
        ) : (
          <li className="text-gray-500">No comments yet</li>
        )}
      </ul>
    </div>
  );
};

export default ProfilePreview;
