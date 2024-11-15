// redux/profile/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../utils/axiosInstance';
import Cookies from 'js-cookie';
import { UserProfileState, UserProfile } from './user-types';

interface UserState extends UserProfileState {
    allUsers: UserProfile[] | null;
}

const initialState: UserState = {
    data: null,
    allUsers: null,
    loading: false,
    error: null,
};

// Fetch user profile
export const fetchUserProfile = createAsyncThunk<UserProfile>(
    'profile/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get('authToken');
            const response = await axiosInstance.get('/users/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

// Fetch all users
export const fetchAllUsers = createAsyncThunk<UserProfile[]>(
    'profile/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get('authToken');
            const response = await axiosInstance.get('/users/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const updateUserProfile = createAsyncThunk<UserProfile, FormData>(
    'profile/updateUserProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const token = Cookies.get('authToken');
            const response = await axiosInstance.put('/users/profile', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error: any) {
            console.error("Error updating profile:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Handle fetchAllUsers actions
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.allUsers = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default userSlice.reducer;
