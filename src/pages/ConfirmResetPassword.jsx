import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NotifyContext } from '../context/NotifyContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { passwordResetConfirm } from '../services/userService';

function ConfirmResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const showNotification = useContext(NotifyContext);
    const navigate = useNavigate();
    const { token } = useParams();

    const validate = () => {
        const errors = {};
        if (newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters";
        if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords must match";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setLoading(true);

        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            setLoading(false);
            return;
        }

        try {
            await passwordResetConfirm(token, newPassword);
            showNotification('Your password has been reset successfully.', 'success');
            navigate('/login');
        } catch (error) {
            // setServerError(error.response?.data?.error || 'An error occurred while resetting your password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        loading ? (<LoadingSpinner />) : (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white px-8 pt-8 pb-4 rounded shadow-md w-80">
                    <h1 className="text-2xl font-semibold text-center mb-6">Reset Password</h1>
                    <p className="text-sm text-gray-600 mb-4 text-center">
                        Enter your new password below.
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <div className="mb-4">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                        </div>

                        <div className="mb-4">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <button type="submit" className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
                            Reset Password
                        </button>
                    </form>
                    {serverError && <div className="bg-red-500 text-white p-3 rounded mt-5">{serverError}</div>}
                    <div className="text-center mt-4">
                        <a href="/login" className="text-sm text-blue-500 hover:underline">Back to Login</a>
                    </div>
                </div>
            </div>
        ));
}

export default ConfirmResetPassword;
