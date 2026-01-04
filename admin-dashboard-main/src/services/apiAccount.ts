import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {ILoginResponse} from "../types/Account/ILoginResponse.ts";
import {IRegisterRequest} from "../types/Account/IRegisterRequest.ts";
import {serialize} from "object-to-formdata";
import {ILoginRequest} from "../types/Account/ILoginRequest.ts";

export const apiAccount = createApi({
    reducerPath: 'apiAccount',
    baseQuery: createBaseQuery("account"),
    tagTypes: ['Account'],
    endpoints: (builder) => ({
        register: builder.mutation<ILoginResponse, IRegisterRequest>({
            query: (data) => {
                const formData = serialize(data, {
                    allowEmptyArrays: true,
                    indices: false,
                });
                return{
                    url: "register",
                    method: "POST",
                    body: formData
                };
            }
        }),
        login: builder.mutation<ILoginResponse, ILoginRequest>({
            query: (data) => {
                return{
                    url: "login",
                    method: "POST",
                    body: data
                };
            }
        })
    })
});

export const {useRegisterMutation, useLoginMutation} = apiAccount;