import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {createApi} from "@reduxjs/toolkit/query/react";
import {IUserProfile} from "../types/Account/IUserProfile.ts";

export const apiUser = createApi({
    reducerPath: "apiUser",
    baseQuery: createBaseQuery("User"),
    tagTypes: ["User"],
    endpoints: (builder) => ({
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

export const { useUpdateUserMutation } = apiUser;
