import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../utils/createBaseQuery";
import {IArea, IRegion, ISettlement, IWarehouse} from "../models/newPost.ts";

export const apiNewPost = createApi({
    reducerPath: "apiNewPost",
    baseQuery: createBaseQuery("NewPost"),
    tagTypes: ["NewPost", "Areas", "Regions", "Settlements", "Settlement","Warehouses"],
    endpoints: (builder) => ({
        getAreas: builder.query<IArea[], void>({
            query: () => {
                return {
                    url: `areas`,
                    method: "GET",
                };
            },
            providesTags: ["Areas"],
        }),

        getRegionsByArea: builder.query<IRegion[], string>({
            query: (areaRef) => {
                return {
                    url: `areas/regions?areaRef=${areaRef}`,
                    method: "GET",
                };
            },
            providesTags: ["Regions"],
        }),

        getSettlements: builder.query<ISettlement[], void>({
            query: () => {
                return {
                    url: `settlement`,
                    method: "GET",
                };
            },
            providesTags: ["Settlements"],
        }),

        getSettlementsByRegion: builder.query<ISettlement[], string>({
            query: (regionRef) => {
                return {
                    url: `region/settlements?regionRef=${regionRef}`,
                    method: "GET",
                };
            },
            providesTags: ["Settlements"],
        }),

        getWarehouses: builder.query<IWarehouse[],string>({
            query: (settlementRef) => {
                return {
                    url: `settlements/warehouses?settlementRef=${settlementRef}`,
                    method: "GET",
                };
            },
            providesTags: ["Warehouses"],
        }),

        getSettlementsById: builder.query<ISettlement, string>({
            query: (settlementsId) => {
                return {
                    url: `settlements?settlementRef=${settlementsId}`,
                    method: "GET",
                };
            },
            providesTags: ["Settlement"],
        }),
    }),
});

export const {
    useGetAreasQuery,
    useGetRegionsByAreaQuery,
    useGetSettlementsQuery,
    useGetSettlementsByRegionQuery,
    useGetSettlementsByIdQuery,
    useGetWarehousesQuery
} = apiNewPost;
