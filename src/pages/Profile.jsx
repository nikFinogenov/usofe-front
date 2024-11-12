// src/pages/Profile.jsx

import React, { useEffect, useState } from 'react';
import { fetchUserPosts, fetchUserInfo } from '../services/userService';
import PostPreview from '../components/PostPreview';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    // const { userId } = useParams();

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex flex-col items-center pt-16 bg-gray-100 min-h-screen">
            
        </div>
    );
}

export default Profile;
