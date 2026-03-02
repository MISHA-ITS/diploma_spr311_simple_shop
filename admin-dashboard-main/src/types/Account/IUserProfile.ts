import {IAdvertisement} from "../../pages/Advertisement/types.ts";

export interface IUserProfile {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    image?: string|null;
    dateRegister: string;
    roles: string[];
    favoriteAdverts: IAdvertisement[];
}