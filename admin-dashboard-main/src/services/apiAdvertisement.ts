import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utils/createBaseQuery.ts";

export interface AdvertisementDto {
    id: number;
    title: string;
    price: number;
    imageUrl: string;
    sellerId: number;
    sellerName: string;
    sellerPhone?: string;
}

export const apiAdvertisement = createApi({
    reducerPath: "apiAdvertisement",
    baseQuery: createBaseQuery("Advertisement"),
    tagTypes: ["Advertisement"],
    endpoints: (builder) => ({
        getAdvertisementById: builder.query<AdvertisementDto, number>({
            query: (id) => `/${id}`,
        }),
    }),
});

export const { useGetAdvertisementByIdQuery } = apiAdvertisement;