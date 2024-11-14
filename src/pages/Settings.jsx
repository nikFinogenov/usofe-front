import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateUser, deleteAccount, deleteAllPosts, uploadAvatar } from '../services/userService';
import { NotifyContext } from '../context/NotifyContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLocation, useNavigate } from 'react-router-dom';

function Settings() {
    const { user, logout, setNewUser } = useContext(AuthContext);
    const showNotification = useContext(NotifyContext);
    const [activeSection, setActiveSection] = useState("edit");
    const [formData, setFormData] = useState({
        fullName: user?.fullName,
        email: user?.email,
        login: user?.login,
    });
    const [errors, setErrors] = useState({});
    const [avatar, setAvatar] = useState(user?.profilePicture);
    const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);  // Ref for file input

    useEffect(() => {
        if (!user) navigate('/');
    }, [user, navigate, location]);

    const validate = () => {
        const errors = {};
        if (!formData.fullName) errors.fullName = "Full name is required";
        if (formData.fullName.length < 2) errors.fullName = "Full name must be at least 2 characters";
        if (!formData.login) errors.login = "Username is required";
        if (formData.login.length < 2) errors.login = "Username must be at least 2 characters";
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Valid email is required";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            showNotification('Invalid file type. Please select an image file (jpeg, jpg, png, gif).', 'error');
            return;
        }

        if (file.size > 1024 * 1024 * 5) {
            showNotification('File size is too large. Maximum size is 5MB.', 'error');
            return;
        }

        setSelectedAvatarFile(file);
        setAvatar(URL.createObjectURL(file));
    };

    const handleAvatarClick = () => {
        // Trigger click on the hidden file input
        fileInputRef.current.click();
    };

    const handleSaveChanges = async () => {
        if (!validate()) {
            showNotification('Please fix the errors in the form', 'error');
            return;
        }

        setLoading(true);
        try {
            const fieldsChanged = formData.fullName !== user.fullName ||
                formData.email !== user.email ||
                formData.login !== user.login;

            if (!fieldsChanged && !selectedAvatarFile) {
                showNotification('No changes detected', 'info');
                return;
            }

            if (selectedAvatarFile) {
                const avatarFormData = new FormData();
                avatarFormData.append('avatar', selectedAvatarFile);
                await uploadAvatar(avatarFormData);
                setSelectedAvatarFile(null)
            }

            if (fieldsChanged) {
                await updateUser(user.id, formData); // Update the context with new user data
            }

            const updatedUser = {
                ...user,
                fullName: formData.fullName,
                email: formData.email,
                login: formData.login,
                profilePicture: selectedAvatarFile ? avatar : user.profilePicture
            };
            // console.log("-->",selectedAvatarFile);
            // console.log("-->",updatedUser);
            // console.log("-->",avatar);
            // console.log("-->",user.profilePicture);
            setNewUser(updatedUser);
            showNotification('Account updated successfully', 'success');
        } catch (error) {
            showNotification(error.response.data.error, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await deleteAccount(user.id);
            showNotification('Account deleted successfully', 'success');
            logout();
            navigate('/');
        } catch (error) {
            showNotification('Failed to delete account', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAllPosts = async () => {
        setLoading(true);
        try {
            await deleteAllPosts(user.id);
            showNotification('All posts deleted successfully', 'success');
        } catch (error) {
            showNotification('Failed to delete posts', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex flex-col items-center pt-16 min-h-screen">
            <h1 className="text-2xl font-bold mt-5 ml-8">Settings</h1>
            <div className="flex w-full max-w-4xl mx-auto shadow-md rounded-lg overflow-hidden">
                <div className="w-1/4 bg-gray-200 p-4">
                    <ul>
                        <li onClick={() => setActiveSection("edit")} className={`cursor-pointer py-2 ${activeSection === "edit" ? 'bg-gray-300 font-semibold' : ''}`}>
                            Edit Account
                        </li>
                        <li onClick={() => setActiveSection("deleteAccount")} className={`cursor-pointer py-2 ${activeSection === "deleteAccount" ? 'bg-gray-300 font-semibold' : ''}`}>
                            Delete Account
                        </li>
                        <li onClick={() => setActiveSection("deletePosts")} className={`cursor-pointer py-2 ${activeSection === "deletePosts" ? 'bg-gray-300 font-semibold' : ''}`}>
                            Delete All Posts
                        </li>
                    </ul>
                </div>

                <div className="w-3/4 p-6">
                    {activeSection === "edit" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Edit Account</h2>
                            <div className="relative flex flex-col items-center mb-4" onClick={handleAvatarClick}>
                                <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full mb-2 cursor-pointer" />
                                <div className="absolute text-white bg-black bg-opacity-50 py-1 px-4 rounded-md top-3/4">Click to change</div>
                                <input
                                    type="file"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    ref={fileInputRef} // Attach ref to input
                                />
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className="space-y-4">
                                <div>
                                    <label htmlFor="fullName" className="text-sm text-gray-600">Full Name</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className="p-3 w-full border rounded-md" />
                                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="text-sm text-gray-600">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="p-3 w-full border rounded-md" />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="login" className="text-sm text-gray-600">Username</label>
                                    <input type="text" name="login" value={formData.login} onChange={handleInputChange} placeholder="Username" className="p-3 w-full border rounded-md" />
                                    {errors.login && <p className="text-red-500 text-sm">{errors.login}</p>}
                                </div>
                                <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">Save Changes</button>
                            </form>
                        </div>
                    )}

                    {activeSection === "deleteAccount" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
                            <p className="text-gray-600 mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                            <button onClick={handleDeleteAccount} className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600">Delete Account</button>
                        </div>
                    )}

                    {activeSection === "deletePosts" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Delete All Posts</h2>
                            <p className="text-gray-600 mb-4">Are you sure you want to delete all your posts? This action cannot be undone.</p>
                            <button onClick={handleDeleteAllPosts} className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600">Delete All Posts</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Settings;
