import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.responseType = 'json';
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle JSON response
axiosInstance.interceptors.response.use(
    (response) => {
        if (response.status === 204) {
            return { ...response, data: null };
        }

        if (typeof response.data === 'string') {
            try {
                response.data = JSON.parse(response.data);
            } catch (error) {
                console.error('Error parsing JSON response:', error);
                return Promise.reject(new Error('Invalid JSON response'));
            }
        }
        return response;
    },
    (error) => {
        console.error('Axios response error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
