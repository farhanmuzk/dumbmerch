import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, User, LoginCredentials, RegisterData } from './auth-types';
import axiosInstance from '../../../utils/axiosInstance';
import Cookies from 'js-cookie';

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

// Define a custom error type for Axios
interface AxiosError {
    response?: {
        data?: {
            message: string;
        };
    };
    message: string;
}

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            const { token } = response.data;

            // Save the token in cookies
            Cookies.set('authToken', token, { expires: 1/24, secure: true, sameSite: 'strict' });

            return response.data; // Should include { token, user }
        } catch (error) {
            const err = error as AxiosError;
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

// Async thunk for register
export const register = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/register', data);
            return response.data; // Should include { message: 'User registered successfully' }
        } catch (error) {
            const err = error as AxiosError;
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

// Create the auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserId(state, action: PayloadAction<User>) {
            state.user = { id: String(action.payload), name: '', email: '', role: 'USER' };
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login cases
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.loading = false;
            state.token = action.payload.token;
            state.user = action.payload.user;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || action.error.message || 'Login failed';
        });

        // Register cases
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Registration failed';
        });
    },
});

export const { logout, setUserId } = authSlice.actions;
export default authSlice.reducer;
