import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {OrderCreateDto, OrderResponseDto} from "../pages/Order/types.ts";

export const apiOrder = createApi({
    reducerPath: "apiOrder",
    baseQuery: createBaseQuery("Order"),
    tagTypes: ["Order"],
    endpoints: (builder) => ({
        createOrder: builder.mutation<OrderResponseDto, OrderCreateDto>({
            query: (order) => ({
                url: "",
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["Order"],
        }),

        getOrderById: builder.query<OrderResponseDto, number>({
            query: (id) => `/${id}`,
            providesTags: ["Order"],
        }),

        getUserOrders: builder.query<OrderResponseDto[], void>({
            query: () => "/my",
            providesTags: ["Order"],
        }),

        deleteOrder: builder.mutation<void, number>({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Order"],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderByIdQuery,
    useGetUserOrdersQuery,
    useDeleteOrderMutation,
} = apiOrder;