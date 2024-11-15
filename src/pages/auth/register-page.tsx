import React from 'react';
import AuthLayout from '../../layouts/auth-layouts';
import AuthBackground from '../../components/Auth/auth-background';
import AuthForm from '../../components/Auth/auth-form';

const Register: React.FC = () => {
    return (
        <AuthLayout>
            <AuthBackground isLogin={false} /> {/* Halaman Register */}
            <AuthForm isLogin={false} />
        </AuthLayout>
    );
};

export default Register;
