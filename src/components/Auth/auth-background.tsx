import React from 'react';
import Logo from '../common/Logo/logo-animation';
import { Link } from 'react-router-dom';

interface AuthBackgroundProps {
    isLogin: boolean; // Determines the active page
}

const AuthBackground: React.FC<AuthBackgroundProps> = ({ isLogin }) => {
    return (
        <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center lg:items-center text-white px-6 sm:px-12 md:px-24 lg:px-5 py-12">
            <div className="flex lg:block flex-col items-center justify-center ">
                <Logo className="w-24 h-24 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-40 lg:h-40" />
                <h2 className="lg:block text-xl text-center lg:text-left sm:text-sm md:text-6xl lg:text-5xl font-bold lg:my-4">
                    Easy, Fast and Reliable
                </h2>
                <p className="lg:block text-center max-w-sm lg:text-left text-sm sm:text-base md:text-lg lg:text-xl">
                    Go shopping for merchandise, just go to dumb merch shopping. The biggest merchandise in Indonesia.
                </p>

                <div className="flex gap-4 mt-6">
                    <Link
                        to="/auth/login"
                        className={`py-2 px-8 lg:py-2 lg:px-6 sm:px-8 md:px-10 lg:px-12 rounded-lg transition duration-300 ease-in-out transform ${isLogin
                            ? "bg-red-600 text-white hover:bg-transparent glow-border-static"
                            : "bg-black text-white border-2 border-white hover:border-red-600 hover:text-white"
                            }`}
                    >
                        Login
                    </Link>
                    <Link
                        to="/auth/register"
                        className={`py-2 px-8 lg:py-2 lg:px-6 sm:px-8 md:px-10 lg:px-12 rounded-lg transition duration-300 ease-in-out transform ${!isLogin
                            ? "bg-red-600 text-white hover:bg-transparent glow-border-static"
                            : "bg-black text-white border-2 border-white hover:border-red-600 hover:text-white"
                            }`}
                    >
                        Register
                    </Link>
                </div>
            </div>


        </div>
    );
};

export default AuthBackground;
