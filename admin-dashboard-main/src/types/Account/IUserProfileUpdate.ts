export interface IUserProfileUpdate {
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    imageFile: File | null;
}