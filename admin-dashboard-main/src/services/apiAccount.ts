import { createApi } from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {IResponse} from "../types/Account/IRegisterRequest.ts";
import {ILoginRequest} from "../types/Account/ILoginRequest.ts";
import {IUserCreate} from "../types/IUserCreate.ts";
import {IUserProfile} from "../types/Account/IUserProfile.ts";
import {serialize} from "object-to-formdata";
import {ServiceResponse} from "../types/IServiceResponse.ts";
//import {ILoginRequest, IResponse, IUserCreate} from "../models/account";

export const apiAccount = createApi({
    reducerPath: "apiAccount",
    baseQuery: createBaseQuery("account"),
    tagTypes: ["Account"],
    endpoints: (builder) => ({
        login: builder.mutation<IResponse,ILoginRequest>({
            query: (data) => {
                return {
                    url: "login",
                    method: "POST",
                    body: data
                }
            }
        }),
        register: builder.mutation<IResponse, IUserCreate>({
            query: (user) => {
                const formData = serialize(user);
                //const formData = new FormData();

                // formData.append("Email", user.email);
                // formData.append("Password", user.password);
                // formData.append("FirstName", user.firstName);
                // formData.append("LastName", user.lastName);
                formData.append("UserName", user.email);
                formData.append("PhoneNumber", user.phoneNumber ?? "");

                // if (user.imageFile instanceof File) {
                //     formData.append("ImageFile", user.imageFile);
                // }

                if (user.imageFile?.file) {
                    formData.append("ImageFile", user.imageFile.file);
                }

                return {
                    url: "register",
                    method: "POST",
                    body: formData,
                };
            },
        }),
        profile: builder.query<ServiceResponse<IUserProfile>, void>({
            query: () => ({
                url: "profile",
                method: "GET"
            }),
            providesTags: ["Account"]
        }),
        addToFavorites: builder.mutation<void, number>({
            query: (advertId) => ({
                url: `../User/favorites/${advertId}`,
                method: 'POST',
            }),
            invalidatesTags: ["Account"],
        }),

        removeFromFavorites: builder.mutation<void, number>({
            query: (advertId) => ({
                url: `../User/favorites/${advertId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Account"],
        }),
        removeAllFromFavorites: builder.mutation<void, void>({
            query: () => ({
                url: `../User/favorites/all`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Account"],
        })
    }),
});

export const {useLoginMutation, useRegisterMutation, useProfileQuery, useAddToFavoritesMutation, useRemoveFromFavoritesMutation, useRemoveAllFromFavoritesMutation } = apiAccount;