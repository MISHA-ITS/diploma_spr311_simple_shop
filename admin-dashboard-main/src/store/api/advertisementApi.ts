import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
//import { ICategory, ICategoryPageRequest } from "../../models/category.ts"
import {IAdvertisement} from "../../pages/Advertisement/types.ts";
//import { PageResponse } from "../../models/category.ts"
import EnvConfig from "../../config/env.ts";

// interface ApiResponse<T> {
//     isSuccess: boolean;
//     message: string;
//     payload: T;
// }

export const advertisementApi = createApi({
    reducerPath: 'advertisementApi',
    baseQuery: fetchBaseQuery({ baseUrl: EnvConfig.API_URL + '/api/Advertisement' }),
    tagTypes: ['Advertisement'],

    endpoints: (builder) => ({
        getAdvertisementById: builder.query<IAdvertisement, number>({
            query: (advertisementId) => {
                return {
                    url: `/${advertisementId}`,
                    method: 'GET',
                }
            },
            providesTags: ["Advertisement"]
        })
    }),
})

export const {
    useGetAdvertisementByIdQuery,
} = advertisementApi