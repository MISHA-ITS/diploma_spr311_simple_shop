export interface IUserProfile {
    fullName: string;
    email: string;
    image?: string|null;
    dateRegister: string;
    roles: string[];
}