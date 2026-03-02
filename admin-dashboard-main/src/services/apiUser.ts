import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {createApi} from "@reduxjs/toolkit/query/react";
import {IUserProfile} from "../types/Account/IUserProfile.ts";
import {
    IUserFilter, IUserItem,
    IUserPagedResponse,
    //IUsersResponse,
    IUserUpdate
} from "../pages/Users/types.ts";
import {serialize} from "object-to-formdata";
import {IResponse} from "../types/Account/IRegisterRequest.ts";
//import {IUser} from "../types/User/types.ts";

interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    payload: T;
}

export const apiUser = createApi({
    reducerPath: "apiUser",
    baseQuery: createBaseQuery("User"),
    tagTypes: ["User", "Favorites"],
    endpoints: (builder) => ({
        // getAllList: builder.query<IUsersResponse, void>({
        //     query: () => 'GetAll/List',
        //     providesTags: ['User']
        // }),
        getAllList: builder.query<IUserPagedResponse, IUserFilter>({
            query: params => ({
                url: "List",
                params
            }),
            providesTags: ["User"]
        }),
        getPaged: builder.query<IUserPagedResponse, IUserFilter>({
            query: params => ({
                url: 'List',
                params
            }),
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

                    updateUser.roles.forEach(role => {
                        formData.append("Roles", role);
                    });

                    if (updateUser.imageFile instanceof File) {
                        formData.append("Image", updateUser.imageFile);
                    }

                    return {
                        url: '',
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
                url: `?id=${id}`,
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
        getUserById: builder.query<ApiResponse<IUserItem>, number>({
            query: (Id) => {
                return {
                    url: `${Id}`,
                    method: 'GET',
                }
            },
            providesTags: (_, __, id) => [{ type: 'User', id }]
        }),
    }),
});

export const {
    useUpdateUserMutation,
    useGetAllListQuery,
    useDeleteUserMutation,
    useLockUserMutation,
    useUnlockUserMutation,
    useGetUserByIdQuery,
} = apiUser;
