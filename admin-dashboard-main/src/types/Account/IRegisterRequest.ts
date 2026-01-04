export interface IRegisterRequest {
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    imageFile?: File | null;
}