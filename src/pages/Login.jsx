import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { NotifyContext } from '../context/NotifyContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [rememberMe, setRememberMe] = useState(false);
    const showNotification = useContext(NotifyContext);
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setLoading(true);
        try {
            const { user, message } = await login(email, password);
            if (user) {
                showNotification(message, 'success');
                navigate('/');
            }
        } catch (error) {

            setServerError(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     if(rememberMe)  {

    //     }
    // }, [rememberMe]);

    return (
        loading ? (<LoadingSpinner />) : (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white px-8 pt-8 pb-4 rounded shadow-md w-80">
                <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="mr-2"
                        />
                        <span>Remember me</span>
                    </div> */}
                    <button type="submit" className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
                        Login
                    </button>
                </form>
                {serverError && <div className="bg-red-500 text-white p-3 rounded mt-5">{serverError}</div>}
                <div className="text-right mb-2">
                    <a href="/forgot-password" className=" text-xs text-blue-500 hover:underline">Forgot password?</a>
                </div>
                <div className="text-center">
                    <a href="/register" className="text-sm text-blue-500 hover:underline">Don't have an account?</a>
                </div>
            </div>
        </div>
    ));
}

export default Login;
