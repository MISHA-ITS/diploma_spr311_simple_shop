import {IAdvertisement} from "../Advertisement/types.ts";

export interface IUserItem {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber: string | null;
    image: string | null;
    dateCreated: string;
    dateOnline: string;
    roles: string[];
    lockoutEnd?: string | null;
    favoriteAdverts: IAdvertisement[];
}

export interface IUsersResponse {
    payload: IUserItem[];
    message: string;
    isSuccess: boolean;
}

export interface IUserUpdate {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    roles: string[];
    imageFile: File | null,
}

export interface IUserRowProps {
    user: IUserItem;
    initials: (name: string) => string;
    onDeleteUser: (userId: number) => Promise<void>;
    onToggleLock: (user: IUserItem) => void | Promise<void>;
    //onEditUser: (user: IUserItem) => void;
}

export interface Props {
    count: number | undefined;
    children: React.ReactNode;
}

export interface IUserPagedResponse {
    payload: {
        items: IUserItem[];
        total: number;
        pageNumber: number;
        pageSize: number;
    };
    isSuccess: boolean;
    message: string;
}

export interface IUserFilter {
    pageNumber: number;
    pageSize: number;
    search?: string;
    isLocked?: boolean;
    roles?: string[];
}