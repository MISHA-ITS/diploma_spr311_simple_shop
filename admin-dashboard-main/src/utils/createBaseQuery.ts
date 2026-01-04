import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../constants/urls.ts";

export const createBaseQuery = (endpoint: string) => {
    return fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/${endpoint}`
    })
};