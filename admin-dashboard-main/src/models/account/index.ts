export interface IUserCreate {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    imageFile?: File | null;
}