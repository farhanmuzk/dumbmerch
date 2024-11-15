// redux/profile/user-types.ts
export interface UserProfile {
    id: number;
    name: string;
    email: string;
    address?: string;
    gender?: string;
    phone_number?: string;
    avatar?: string;
    role: 'USER' | 'ADMIN';
}

export interface UserProfileState {
    data: UserProfile | null;
    loading: boolean;
    error: string | null;
}
