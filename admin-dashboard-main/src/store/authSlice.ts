import { saveLocalStorage, getLocalStorage, deleteLocalStorage } from "../utils/secureStore.ts";
import {jwtDecode} from "jwt-decode";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IUser} from "../types/auth/IUser.ts";
//import {IUser} from "../models/account";
import {IAuthState} from "../types/auth/IAuthState.ts";
//import {IAuthState} from "../models/account";

export const getUserFromToken = (token: string): IUser | null => {
    try {
        const decodedToken = jwtDecode<IUser>(token);
        const roles: string[] = [];

        if (typeof decodedToken.roles === 'string') {
            roles.push(decodedToken.roles);
        } else if (Array.isArray(decodedToken.roles)) {
            roles.push(...decodedToken.roles);
        }

        return {
            id: decodedToken.id,
            email: decodedToken.email,
            fullName: decodedToken.fullName,
            image: decodedToken.image,
            roles: roles,
        } as IUser;
    }
    catch(e) {
        console.log("Invalid token", e);
        return null;
    }
}

const token = getLocalStorage("token");

const initUser = token ? getUserFromToken(token) : null;

const initState: IAuthState = {
    user: initUser,
}

const authSlice = createSlice({
    name:  'auth',
    initialState: initState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<string>) => {
            const token = action.payload;
            const user = getUserFromToken(token);
            if(user) {
                saveLocalStorage("token", token);
                state.user = user;
            }
        },
        logout: (state) => {
            deleteLocalStorage("token");
            state.user = null;
        },
    }
});

export const {loginSuccess, logout} = authSlice.actions;

export default authSlice.reducer;

//console.log("Auth token", initState);