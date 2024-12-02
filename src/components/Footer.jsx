import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa'; 

function Footer() {
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [isTripleClicked, setIsTripleClicked] = useState(false); 

    const handleFooterClick = (e) => {
        if (e.detail === 3) {
            setIsTripleClicked(!isTripleClicked); 
        }
    };

    return (
        <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
            <div className="flex justify-between items-center">
                <p
                    onClick={handleFooterClick}
                    className="text-center cursor-pointer"
                >
                    <span>&copy; 2024 {isTripleClicked ? <a
                        href="https://github.com/kitska/S-DF"
                        className="text-gray-300 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        S?DF
                    </a> : <span>Muffin Forum</span>} All rights reserved.</span>
                </p>

                <div className="flex space-x-4">
                    <button
                        onClick={() => setShowAboutModal(true)}
                        className="text-gray-300 hover:underline"
                    >
                        About
                    </button>
                    <button
                        onClick={() => setShowContactModal(true)}
                        className="text-gray-300 hover:underline"
                    >
                        Contact
                    </button>
                </div>
            </div>

            {
                showAboutModal && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 text-black">
                        <div className="relative bg-white p-6 rounded-md w-4/5 md:w-1/3 z-60">
                            <button
                                onClick={() => setShowAboutModal(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes />
                            </button>
                            <h3 className="text-lg font-semibold mb-4">About Us</h3>
                            <p>This is a forum where you can discuss various topics and share your thoughts.</p>
                            <p>We aim to create a friendly and inclusive environment for all users.</p>
                        </div>
                    </div>
                )
            }

            {
                showContactModal && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                        <div className="relative bg-white p-6 rounded-md w-4/5 md:w-1/3 z-60">
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes />
                            </button>
                            <h3 className="text-lg font-semibold mb-4 text-black">Contact Us</h3>
                            <p className='text-black'>For any inquiries, please email us at:</p>
                            <a
                                href="mailto:support@myforum.com"
                                className="text-blue-500 hover:underline ml-1"
                            >
                                support@myforum.com
                            </a>
                        </div>
                    </div>
                )
            }
        </footer >
    );
}

export default Footer;
