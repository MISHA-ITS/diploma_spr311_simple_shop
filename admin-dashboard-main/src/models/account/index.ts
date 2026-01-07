export interface IUserCreate {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    imageFile?: File | null;
}

export interface IUser {
    id: string;
    email: string;
    fullName: string;
    image: string | null;
    roles: string[] | string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IResponse {
    isSuccess: boolean;
    message: string;
    payload: string;
}

export interface IAuthState {
    user: IUser | null;
}

