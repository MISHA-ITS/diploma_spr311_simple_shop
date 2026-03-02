import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {IOrder, OrderCreateDto, OrderResponseDto} from "../pages/Order/types.ts";

interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    payload: T;
}

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

        getMySellerOrders: builder.query<ApiResponse<IOrder[]>, void>({
            query: () => "/seller",
            providesTags: ["Order"],
        }),

        getMyBuyerOrders: builder.query<ApiResponse<IOrder[]>, void>({
            query: () => "/buyer",
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
    useGetMyBuyerOrdersQuery,
    useGetMySellerOrdersQuery,
    useDeleteOrderMutation,
} = apiOrder;