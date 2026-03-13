import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {IOrder, OrderCreateDto, OrderDetailsDto, OrderResponseDto, OrderStatus} from "../pages/Order/types.ts";

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

        getOrderById: builder.query<ApiResponse<OrderResponseDto>, number>({
            query: (id) => `/${id}`,
            providesTags: ["Order"],
        }),

        getOrderDetails: builder.query<ApiResponse<OrderDetailsDto>, number>({
            query: (id) => `/orders/${id}`
        }),

        getMySellerOrders: builder.query<ApiResponse<IOrder[]>, void>({
            query: () => "/seller",
            providesTags: ["Order"],
        }),

        getMyBuyerOrders: builder.query<ApiResponse<IOrder[]>, void>({
            query: () => "/buyer",
            providesTags: ["Order"],
        }),

        updateOrderStatus: builder.mutation<void, { id: number; status: OrderStatus }>({
            query: ({ id, status }) => ({
                url: `/${id}/status`,
                method: "PATCH",
                body: { status }
            }),
            invalidatesTags: ["Order"],
        }),

        cancelOrder: builder.mutation<void, number>({
            query: (id) => ({
                url: `/${id}/cancel`,
                method: "PATCH"
            }),
            invalidatesTags: ["Order"],
        }),

        deleteOrder: builder.mutation<void, number>({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Order"],
        }),

        confirmOrder: builder.mutation<void, number>({
            query: (id) => ({
                url: `/orders/${id}/confirm`,
                method: "PUT"
            })
        }),

        rejectOrder: builder.mutation<void, number>({
            query: (id) => ({
                url: `/orders/${id}/reject`,
                method: "PUT"
            })
        }),

        shipOrder: builder.mutation<void, number>({
            query: (id) => ({
                url: `/orders/${id}/ship`,
                method: "PUT"
            })
        }),

        completeOrder: builder.mutation<void, number>({
            query: (id) => ({
                url: `/orders/${id}/complete`,
                method: "PUT"
            })
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderByIdQuery,
    useGetMyBuyerOrdersQuery,
    useGetMySellerOrdersQuery,
    useUpdateOrderStatusMutation,
    useCancelOrderMutation,
    useDeleteOrderMutation,
    useConfirmOrderMutation,
    useRejectOrderMutation,
    useShipOrderMutation,
    useCompleteOrderMutation,
} = apiOrder;