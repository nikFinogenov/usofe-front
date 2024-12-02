import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { emailConfirm } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';


function ConfirmEmail() {
    const { token } = useParams();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                await emailConfirm(token);
                setSuccess(true);
                user.emailConfirmed = true;

            } catch (err) {
                
                setError(err.response.data.error);
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        confirmEmail();
    }, [token, user]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white px-8 pt-8 pb-6 rounded shadow-md w-96 text-center">
                {success ? (
                    <>
                        <h1 className="text-2xl font-semibold mb-4 text-green-500">Email Confirmed!</h1>
                        <p className="text-gray-700 mb-6">
                            Your account has been successfully activated. You can now explore the platform and start using all its features!
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold mb-4 text-red-500">Error</h1>
                        <p className="text-gray-700 mb-6">{error}</p>
                    </>
                )}
                <Link
                    to="/"
                    className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md text-center font-semibold hover:bg-blue-600"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
}

export default ConfirmEmail;
