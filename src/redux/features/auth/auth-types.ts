export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'USER' | 'ADMIN';
}

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
    avatar?: string;
}
