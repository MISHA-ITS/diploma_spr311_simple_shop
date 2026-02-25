import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {IAdvertisement} from "../pages/Advertisement/types.ts";
import EnvConfig from "../config/env.ts";

interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    payload: T;
}

export const apiAdvertisement = createApi({
    reducerPath: 'apiAdvertisement',
    baseQuery: fetchBaseQuery({
        baseUrl: EnvConfig.API_URL + '/api/Advertisement',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');

            if (token) {
                headers.set('authorization', `Bearer ${token.replace(/"/g, '')}`);
            }

            return headers;
        },
    }),
    tagTypes: ['Advertisements'],

    endpoints: (builder) => ({
        getAdvertisementById: builder.query<ApiResponse<IAdvertisement>, number>({
            query: (Id) => {
                return {
                    url: `/${Id}`,
                    method: 'GET',
                }
            },
            providesTags: (_, __, id) => [{ type: 'Advertisements', id }]
        }),
        createAdvertisement: builder.mutation<void, FormData>({
            query: (newAdvertisement) => ({
                url: `/create`,
                method: 'POST',
                body: newAdvertisement,
            }),
            invalidatesTags: ['Advertisements'],
        }),
    }),
})

export const {
    useGetAdvertisementByIdQuery,
    useCreateAdvertisementMutation,
} = apiAdvertisement