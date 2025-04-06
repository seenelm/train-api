import { ObjectId } from "mongodb";

export interface UserRegisterResponse {
    userId: string;
    token: string;
    username: string;
    name: string;
}

export interface UserLoginResponse {
    userId: string;
    token: string;
    username: string;
    name: string;
}
