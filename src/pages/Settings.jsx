import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateUser, deleteAccount, deleteAllPosts, uploadAvatar } from '../services/userService';
import { PencilIcon } from '@heroicons/react/20/solid';

function Settings() {
    const { user } = useContext(AuthContext);
    const [activeSection, setActiveSection] = useState("edit");
    const [formData, setFormData] = useState({
        fullName: user.fullName,
        email: user.email,
        login: user.login,
    });
    const [avatar, setAvatar] = useState(user.profilePicture);
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAvatarClick = () => {
        setIsEditingAvatar(true);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setSelectedAvatarFile(file);
        setAvatar(URL.createObjectURL(file)); // Show the preview
    };

    const handleSaveChanges = async () => {
        try {
            // Update the avatar if a new file is selected
            if (selectedAvatarFile) {
                const avatarFormData = new FormData();
                avatarFormData.append('avatar', selectedAvatarFile);
                await uploadAvatar(avatarFormData);
            }
            // Update other user info
            await updateUser(user.id, formData);
            alert('Account updated successfully');
        } catch (error) {
            console.error('Failed to update account:', error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount(user.id);
            alert('Account deleted successfully');
            // Perform logout or redirection here
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    const handleDeleteAllPosts = async () => {
        try {
            await deleteAllPosts(user.id);
            alert('All posts deleted successfully');
        } catch (error) {
            console.error('Failed to delete posts:', error);
        }
    };

    return (
        <div className="flex flex-col items-center pt-16 min-h-screen">
            <h1 className="text-2xl font-bold mt-5 ml-8">Settings</h1>
            <div className="flex max-w-4xl w-full mx-auto shadow-md rounded-lg overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/4 bg-gray-200 p-4">
                    <ul>
                        <li
                            onClick={() => setActiveSection("edit")}
                            className={`cursor-pointer py-2 ${activeSection === "edit" ? 'bg-gray-300 font-semibold' : ''}`}
                        >
                            Edit Account
                        </li>
                        <li
                            onClick={() => setActiveSection("deleteAccount")}
                            className={`cursor-pointer py-2 ${activeSection === "deleteAccount" ? 'bg-gray-300 font-semibold' : ''}`}
                        >
                            Delete Account
                        </li>
                        <li
                            onClick={() => setActiveSection("deletePosts")}
                            className={`cursor-pointer py-2 ${activeSection === "deletePosts" ? 'bg-gray-300 font-semibold' : ''}`}
                        >
                            Delete All Posts
                        </li>
                    </ul>
                </div>

                {/* Content Section */}
                <div className="w-3/4 p-6">
                    {activeSection === "edit" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Edit Account</h2>
                            <div className="relative flex flex-col items-center mb-4">
                                <img
                                    src={avatar}
                                    alt="Avatar"
                                    onClick={handleAvatarClick}
                                    className="w-24 h-24 rounded-full mb-2 cursor-pointer"
                                />
                                {isEditingAvatar && (
                                    <>
                                        <label htmlFor="avatarInput">
                                            <PencilIcon className="w-6 h-6 text-gray-700 absolute bottom-2 right-10 cursor-pointer" />
                                            
                                        </label>
                                        <input
                                            type="file"
                                            id="avatarInput"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </>
                                )}
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className="space-y-4">
                                <div>
                                    <label htmlFor="fullName" className="text-sm text-gray-600">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Full Name"
                                        className="p-3 w-full border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="text-sm text-gray-600">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        className="p-3 w-full border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="login" className="text-sm text-gray-600">Username</label>
                                    <input
                                        type="text"
                                        name="login"
                                        value={formData.login}
                                        onChange={handleInputChange}
                                        placeholder="Username"
                                        className="p-3 w-full border rounded-md"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {activeSection === "deleteAccount" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
                            <p className="mb-2 text-red-600">
                                This action is irreversible. All your data will be permanently deleted.
                            </p>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isConfirmed}
                                    onChange={(e) => setIsConfirmed(e.target.checked)}
                                    className="form-checkbox text-red-600"
                                />
                                <span className="ml-2">I understand the consequences.</span>
                            </label>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={!isConfirmed}
                                className={`w-full bg-red-500 text-white p-3 rounded-md mt-4 ${!isConfirmed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                                    }`}
                            >
                                Delete Account
                            </button>
                        </div>
                    )}

                    {activeSection === "deletePosts" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Delete All Posts</h2>
                            <p className="mb-2 text-yellow-600">
                                This action will delete all your posts. This action is irreversible.
                            </p>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isConfirmed}
                                    onChange={(e) => setIsConfirmed(e.target.checked)}
                                    className="form-checkbox text-yellow-600"
                                />
                                <span className="ml-2">I understand the consequences.</span>
                            </label>
                            <button
                                onClick={handleDeleteAllPosts}
                                disabled={!isConfirmed}
                                className={`w-full bg-yellow-500 text-white p-3 rounded-md mt-4 ${!isConfirmed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
                                    }`}
                            >
                                Delete All Posts
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Settings;
