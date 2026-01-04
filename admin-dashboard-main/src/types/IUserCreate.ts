import {IImageFile} from "./IImageFile.ts";

export interface IUserCreate {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    imageFile: IImageFile | null;
}