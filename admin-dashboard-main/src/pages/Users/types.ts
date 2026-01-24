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
}

export interface IUserRowProps {
    user: IUserItem;
    initials: (name: string) => string;
    onDeleteUser: (userId: number) => Promise<void>;
}

export interface Props {
    count: number;
    children: React.ReactNode;
}