// Register.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NotifyContext } from '../context/NotifyContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function Register() {
    const { register } = useContext(AuthContext);
    const showNotification = useContext(NotifyContext);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!fullName) errors.fullName = "Full name is required";
        if (!username) errors.username = "Username is required";
        if (fullName.length < 2) errors.fullName = "Full name must be at least 2 characters";
        if (username.length < 2) errors.username = "Username must be at least 2 characters";
        if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = "Valid Email is required";
        if (password.length < 6) errors.password = "Password must be at least 6 characters";
        if (password !== confirmPassword) errors.confirmPassword = "Passwords must match";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        setServerError('');
        setLoading(true);
        if (Object.keys(validationErrors).length === 0) {
            try {
                const message = await register(email, username, fullName, password);
                if (message) {
                    // onNotification(message, 'info');  // Отправляем уведомление на главную страницу
                    showNotification(message, 'success');
                    navigate('/');
                }
            } catch (error) {
                setServerError(error.response.data.error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    return (
        loading ? (<LoadingSpinner />) : (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-96">
                    <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="col-span-1">
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Full Name"
                                    className="p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                            </div>
                            <div className="col-span-1">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className="p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                            </div>
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

                        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
                            Register
                        </button>
                    </form>
                    {serverError && <div className="bg-red-500 text-white p-3 rounded mt-5">{serverError}</div>}
                </div>
            </div>))
}

export default Register;
