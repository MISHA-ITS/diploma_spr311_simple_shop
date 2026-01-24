import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {createApi} from "@reduxjs/toolkit/query/react";
import {IUserProfile} from "../types/Account/IUserProfile.ts";
import {IUsersResponse} from "../pages/Users/types.ts";

export const apiUser = createApi({
    reducerPath: "apiUser",
    baseQuery: createBaseQuery("User"),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getAllList: builder.query<IUsersResponse, void>({
            query: () => 'GetAll/List',
            providesTags: ['User']
        }),

        updateUser: builder.mutation<IUserProfile, FormData>({
            query: (data) => ({
                url: "UpdateAsync",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const { useUpdateUserMutation, useGetAllListQuery } = apiUser;
