import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {createApi} from "@reduxjs/toolkit/query/react";
import {IUserProfile} from "../types/Account/IUserProfile.ts";
import {IUsersResponse, IUserUpdate} from "../pages/Users/types.ts";
import {serialize} from "object-to-formdata";
import {IResponse} from "../types/Account/IRegisterRequest.ts";

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
                    console.log("User info", updateUser);
                    const formData = serialize(updateUser);

                    if (updateUser.imageFile instanceof File) {
                        formData.append("Image", updateUser.imageFile);
                    }

                    return {
                        url: 'update',
                        method: 'PUT',
                        body: formData
                    }
                }
                catch {
                    throw new Error('Error update user');
                }
            },
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation<{ isSuccess: boolean; message: string }, number>({
            query: (id) => ({
                url: `delete?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
        lockUser: builder.mutation<IResponse, number>({
            query: id => ({
                url: `Lock?id=${id}`,
                method: "POST"
            }),
            invalidatesTags: ["User"]
        }),

        unlockUser: builder.mutation<IResponse, number>({
            query: id => ({
                url: `Unlock?id=${id}`,
                method: "POST"
            }),
            invalidatesTags: ["User"]
        }),
    }),
});

export const {
    useUpdateUserMutation,
    useGetAllListQuery,
    useDeleteUserMutation,
    useLockUserMutation,
    useUnlockUserMutation,
} = apiUser;
