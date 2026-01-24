export interface IUserProfile {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    image?: string|null;
    dateRegister: string;
    roles: string[];
}