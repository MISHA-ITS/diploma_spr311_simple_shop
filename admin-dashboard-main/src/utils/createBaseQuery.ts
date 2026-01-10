import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import EnvConfig from "../config/env.ts";
import {getLocalStorage} from "./secureStore.ts";

export const createBaseQuery = (endpoint: string) => {
    return fetchBaseQuery({
        baseUrl: `${EnvConfig.API_URL}/api/${endpoint}`,
        prepareHeaders: (headers) => {
            const token = getLocalStorage("token");
            if(token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    });
};
