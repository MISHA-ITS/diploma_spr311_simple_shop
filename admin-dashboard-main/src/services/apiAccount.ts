import { createApi } from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {ILoginRequest, IResponse, IUserCreate} from "../models/account";

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
                const formData = new FormData();

                formData.append("FirstName", user.firstName);
                formData.append("LastName", user.lastName);
                formData.append("UserName", user.email);
                formData.append("Email", user.email);
                formData.append("Password", user.password);

                if (user.imageFile instanceof File) {
                    formData.append("Image", user.imageFile);
                }

                return {
                    url: "register",
                    method: "POST",
                    body: formData,
                };
            },
        }),
    }),
});

export const {useLoginMutation, useRegisterMutation } = apiAccount;