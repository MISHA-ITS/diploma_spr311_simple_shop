import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {IAdvertisement} from "../pages/Advertisement/types.ts";
import EnvConfig from "../config/env.ts";
import {IAdvFilter} from "../pages/AdvCategoryPage/types.ts";

interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    payload: T;
}

interface ApiPageResponce<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
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
        getMyAdvertisements: builder.query<ApiResponse<IAdvertisement[]>, void>({
            query: () => ({
                url: "my",
                method: "GET"
            }),
            providesTags: ["Advertisements"]
        }),
        getAdvertisements: builder.query<ApiResponse<ApiPageResponce<IAdvertisement>>, IAdvFilter>({
            query: (filter) => {
                const queryString = new URLSearchParams(
                    Object.entries(filter)
                        .filter(([, value]) => value !== null && value !== undefined)
                        .map(([key, value]) => [key, String(value)])
                ).toString();

                return {
                    url: `/list?${queryString}`,
                    method: "GET"
                }
            }
        }),
        getUserAdvertisements: builder.query<ApiResponse<IAdvertisement[]>, number>({
            query: (Id) => ({
                url: `/userAdverts/${Id}`,
                method: "GET"
            }),
            providesTags: ["Advertisements"]
        }),
        updateAdvertisement: builder.mutation<void, FormData>({
            query: (formData) => ({
                url: `/update`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Advertisements'],
        }),
    }),
})

export const {
    useGetAdvertisementByIdQuery,
    useCreateAdvertisementMutation,
    useGetMyAdvertisementsQuery,
    useGetAdvertisementsQuery,
    useGetUserAdvertisementsQuery,
    useUpdateAdvertisementMutation,
} = apiAdvertisement