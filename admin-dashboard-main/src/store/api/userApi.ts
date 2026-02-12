import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {IUser} from "../../types/User/types.ts";
import EnvConfig from "../../config/env.ts";

interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    payload: T;
}

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: EnvConfig.API_URL + '/api/User' }),
    tagTypes: ['User'],

    endpoints: (builder) => ({
        getUserById: builder.query<ApiResponse<IUser>, number>({
            query: (Id) => {
                return {
                    url: `Get/${Id}`,
                    method: 'GET',
                }
            },
            providesTags: (_, __, id) => [{ type: 'User', id }]
        })
    }),
})

export const {
    useGetUserByIdQuery,
} = userApi