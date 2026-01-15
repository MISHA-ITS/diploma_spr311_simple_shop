import {IUser} from "./IUser.ts";

export interface IAuthState {
    user: IUser | null;
}