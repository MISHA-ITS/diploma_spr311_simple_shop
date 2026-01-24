import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {createApi} from "@reduxjs/toolkit/query/react";
import {IUserProfile} from "../types/Account/IUserProfile.ts";
import {IUsersResponse, IUserUpdate} from "../pages/Users/types.ts";
import {serialize} from "object-to-formdata";

export const apiUser = createApi({
    reducerPath: "apiUser",
    baseQuery: createBaseQuery("User"),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getAllList: builder.query<IUsersResponse, void>({
            query: () => 'GetAll/List',
            providesTags: ['User']
        }),

        // updateUser: builder.mutation<IUserProfile, FormData>({
        //     query: (data) => ({
        //         url: "UpdateAsync",
        //         method: "PUT",
        //         body: data,
        //     }),
        //     invalidatesTags: ["User"],
        // }),

        updateUser: builder.mutation<IUserProfile, IUserUpdate>({
            query: (updateUser) => {
                try {
                    const formData = serialize(updateUser);
                    return {
                        url: 'UpdateAsync',
                        method: 'POST',
                        body: formData
                    }
                }
                catch {
                    throw new Error('Error create category');
                }
            },
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useUpdateUserMutation, useGetAllListQuery } = apiUser;
