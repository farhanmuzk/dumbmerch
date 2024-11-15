import React from 'react';
import AuthLayout from '../../layouts/auth-layouts';
import AuthBackground from '../../components/Auth/auth-background';
import AuthForm from '../../components/Auth/auth-form';

const Login: React.FC = () => {
    return (
        <AuthLayout>
            <AuthBackground isLogin={true} />
            <AuthForm isLogin={true} />
        </AuthLayout>
    );
};

export default Login;
