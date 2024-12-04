import React, { useState } from 'react';

function UpdateUserModal({ user, onClose, onSave }) {
    const [updatedUser, setUpdatedUser] = useState({ ...user });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const fieldsChanged = Object.keys(updatedUser).some(
                (key) => updatedUser[key] !== user[key]
            );

            if (fieldsChanged) {
                await onSave(updatedUser);
            } else {
                console.log('No changes detected');
            }
        } catch (error) {
            console.error('Failed to save user updates:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Update User Details</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="fullName"
                        value={updatedUser.fullName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Full Name"
                    />
                    <input
                        type="email"
                        name="email"
                        value={updatedUser.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Email"
                    />
                    <input
                        type="text"
                        name="login"
                        value={updatedUser.login}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Login"
                    />
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Password (optional)"
                    />
                    <select
                        name="role"
                        value={updatedUser.role}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateUserModal;
