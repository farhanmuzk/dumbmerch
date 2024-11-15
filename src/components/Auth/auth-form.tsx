import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../../redux/features/auth/auth-slice';
import { AppDispatch, RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { loginSchema, registerSchema } from '../../components/common/Validation/auth.schema';

interface AuthFormProps {
    isLogin: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { error } = useSelector((state: RootState) => state.auth);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setValidationErrors((prev) => ({ ...prev, [name]: '' })); // **Fixed:** Updated to use functional state update
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError(null);
        setValidationErrors({});
        setIsSubmitting(true);

        try {
            if (isLogin) {
                loginSchema.parse({ email: formData.email, password: formData.password });
                await handleLogin();
            } else {
                registerSchema.parse(formData);
                await handleRegister();
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: { [key: string]: string } = {};
                error.errors.forEach((err) => {
                    newErrors[err.path[0]] = err.message;
                });
                setValidationErrors(newErrors);
            } else {
                setGeneralError("An unexpected error occurred.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await dispatch(login({ email: formData.email, password: formData.password })).unwrap();
            Cookies.set('authToken', response.token, { expires: 1 / 24 });
            Cookies.set('userRole', response.user.role);
            Cookies.set('userId', response.user.id); // Menyimpan userId di cookie
            navigateWithDelay(response.user.role === 'ADMIN' ? '/admin/dashboard' : '/user/home');
        } catch (error) {
            console.error('Login failed:', error);
            setGeneralError("Login failed. Please check your credentials.");
        }
    };


    const handleRegister = async () => {
        try {
            await dispatch(register({ name: formData.name, email: formData.email, password: formData.password })).unwrap();
            navigateWithDelay('/auth/login');
        } catch (error) {
            console.error('Register failed:', error);
            setGeneralError("Registration failed. Please try again.");
        }
    };

    const navigateWithDelay = (path: string) => {
        setTimeout(() => {
            navigate(path);
        }, 2000);
    };

    useEffect(() => {
        setFormData({ name: '', email: '', password: '' });
        setValidationErrors({});
        setGeneralError(null);
    }, [isLogin]);

    return (
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 h-full md:h-screen p-4">
            <div className="hidden md:block text-left md:mb-4 lg:mt-6">
                <h1 className="text-4xl md:text-5xl font-bold text-neutral font-poppins">{isLogin ? 'Welcome Back!' : 'Get Started'}</h1>
                <p className="text-lg md:text-xl text-neutral mx-2 my-2 font-poppins">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <a href={isLogin ? '/auth/register' : '/auth/login'} className="text-secondary">
                        <u>{isLogin ? 'Register' : 'Login'}</u>
                    </a>
                </p>
            </div>
            <div className="bg-transparent p-2 md:p-8 rounded-lg shadow-lg w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <InputField
                            label="Username"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Enter username"
                            error={validationErrors.name}
                        />
                    )}
                    <InputField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        type="email"
                        placeholder="Enter email"
                        error={validationErrors.email}
                    />
                    <InputField
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        type="password"
                        placeholder="Enter password"
                        error={validationErrors.password}
                    />
                    <button
                        type="submit"
                        className={`w-full border-2 text-neutral py-2 rounded-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-transparent hover:border hover:border-2 border-red-600 transition duration-300'}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Loading...' : isLogin ? 'Login' : 'Register'}
                    </button>
                    {generalError && <p className="text-secondary text-sm mt-2 font-poppins">{generalError}</p>}
                    {error && <p className="text-secondary text-sm mt-2 font-poppins">{error}</p>}
                </form>
            </div>
        </div>
    );
};

interface InputFieldProps {
    label: string;
    name: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    error?: string | null;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type, value, onChange, placeholder, error }) => (
    <div className="mb-4">
        <label className="block my-2 text-sm font-medium text-gray-200 font-poppins">
            {label} <span className="text-secondary">*</span>
        </label>
        <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 bg-transparent text-white border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent sm:text-sm ${error ? 'border-secondary' : 'border-gray-400'}`}
        />
        {error && <p className="text-secondary text-sm mt-1 font-poppins">{error}</p>}
    </div>
);

export default AuthForm;
