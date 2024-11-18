import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotifyContext } from '../context/NotifyContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { passwordReset } from '../services/userService';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const showNotification = useContext(NotifyContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setLoading(true);
        try {
            // Mock API call to request password reset
            // await fakeApiRequestPasswordReset(email);
            await passwordReset(email)
            showNotification('Password reset instructions have been sent to your email.', 'success');
            navigate('/login');
        } catch (error) {
            setServerError(error.response.data.error);
            // showNotification(error.response.data.error, 'info'); 
        } finally {
            setLoading(false);
        }
    };

    return (
        loading ? (<LoadingSpinner />) : (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white px-8 pt-8 pb-4 rounded shadow-md w-80">
                    <h1 className="text-2xl font-semibold text-center mb-2">Forgot Password</h1>
                    <p className="text-sm text-gray-600 mb-4 text-center">
                        Please enter the e-mail address you provided during registration.
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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

export default ForgotPassword;
