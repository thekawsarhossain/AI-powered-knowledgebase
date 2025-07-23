export interface User {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserWithPassword extends User {
    password: string;
}

export interface AuthPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}
