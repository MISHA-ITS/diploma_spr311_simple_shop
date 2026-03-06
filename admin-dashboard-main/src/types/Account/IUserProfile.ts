import {IAdvertisement} from "../../pages/Advertisement/types.ts";

export interface IUserProfile {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    image?: string|null;
    createdAt: string;
    roles: string[];
    favoriteAdverts: IAdvertisement[];
}