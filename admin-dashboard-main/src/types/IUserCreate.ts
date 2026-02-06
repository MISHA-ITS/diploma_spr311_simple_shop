import {IImageFile} from "./IImageFile.ts";

export interface IUserCreate {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    imageFile: IImageFile | null;
}