export interface UserRegisterRequest {
    username: string;
    password: string;
    name: string;
}

export interface UserLoginRequest {
    username: string;
    password: string;
}

export interface GoogleAuthRequest {
    idToken: string;
    name?: string;
}

export interface UserResponse {
    userId: string;
    token: string;
    username: string;
    name: string;
}
