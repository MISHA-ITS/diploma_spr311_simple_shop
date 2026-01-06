import {IUser} from "../types/auth/IUser.ts";
import {jwtDecode} from "jwt-decode";
import {IAuthState} from "../types/auth/IAuthState.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const token = localStorage.getItem('token');

export const getUserFromToken = (token: string): IUser | null => {
    try {
        const decodedToken = jwtDecode<IUser>(token);
        let roles: string[] = [];

        if (typeof decodedToken.roles === "string") {
            roles = decodedToken.roles;
        }
        else if (Array.isArray(decodedToken.roles)){
            roles = decodedToken.roles;
        }

        return {
            email: decodedToken.email,
            name: decodedToken.name,
            image: decodedToken.image,
            roles: roles
        }
    }
    catch (e) {
        console.log("Invalid token", e);
        return null;
    }
}

const initUser = token ? getUserFromToken(token) : null;

const initState: IAuthState = {
    user: initUser,
}

const authSlice = createSlice({
    name: "auth",
    initialState: initState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            const token = action.payload;
            const user = getUserFromToken(token);
            if(user) {
                localStorage.getItem('token'); //це щоб при перезапуску додатку користувач не вилітав
                state.user = user;
            }
        },
        logout: (state) => {
            localStorage.removeItem("token");
            state.user = null;
        },
    }
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;

//console.log("Auth token", initState);