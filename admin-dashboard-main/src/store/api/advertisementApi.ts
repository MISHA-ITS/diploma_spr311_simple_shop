import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {IAdvertisement} from "../../pages/Advertisement/types.ts";
import EnvConfig from "../../config/env.ts";

interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    payload: T;
}

export const advertisementApi = createApi({
    reducerPath: 'advertisementApi',
    baseQuery: fetchBaseQuery({ baseUrl: EnvConfig.API_URL + '/api/Advertisment' }),
    tagTypes: ['Advertisement'],

    endpoints: (builder) => ({
        getAdvertisementById: builder.query<ApiResponse<IAdvertisement>, number>({
            query: (Id) => {
                return {
                    url: `/${Id}`,
                    method: 'GET',
                }
            },
            providesTags: (_, __, id) => [{ type: 'Advertisement', id }]
        })
    }),
})

export const {
    useGetAdvertisementByIdQuery,
} = advertisementApi