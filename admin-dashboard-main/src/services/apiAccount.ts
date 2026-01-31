import { createApi } from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {IResponse} from "../types/Account/IRegisterRequest.ts";
import {ILoginRequest} from "../types/Account/ILoginRequest.ts";
import {IUserCreate} from "../types/IUserCreate.ts";
import {IUserProfile} from "../types/Account/IUserProfile.ts";
//import {serialize} from "object-to-formdata";
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
                //const formData = serialize(user);
                const formData = new FormData();

                formData.append("Email", user.email);
                formData.append("Password", user.password);
                formData.append("FirstName", user.firstName);
                formData.append("LastName", user.lastName);
                formData.append("UserName", user.email);

                if (user.imageFile instanceof File) {
                    formData.append("ImageFile", user.imageFile);
                }

                return {
                    url: "register",
                    method: "POST",
                    body: formData,
                };
            },
        }),
        profile: builder.query<IUserProfile, void>({
            query: () => ({
                url: "profile",
                method: "GET"
            }),
            providesTags: ["Account"]
        }),
    }),
});

export const {useLoginMutation, useRegisterMutation, useProfileQuery } = apiAccount;