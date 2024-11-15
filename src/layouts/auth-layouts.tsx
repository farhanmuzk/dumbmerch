import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col md:flex-row h-screen bg-primary w-full">
            {children}
        </div>
    );
};

export default AuthLayout;
