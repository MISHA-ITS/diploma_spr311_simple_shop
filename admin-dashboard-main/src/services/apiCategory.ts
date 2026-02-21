import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { ICategory, ICategoryPageRequest } from "../models/category.ts"
import { PageResponse } from "../models/category.ts"
import EnvConfig from "../config/env.ts";

interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    payload: T;
}

export const apiCategory = createApi({
    reducerPath: 'apiCategory',
    baseQuery: fetchBaseQuery({ baseUrl: EnvConfig.API_URL + '/api/Category' }),
    tagTypes: ['Categories','CategoriesPage','Category'],

    endpoints: (builder) => ({
        getCategoryPage: builder.query<ApiResponse<PageResponse<ICategory>>, ICategoryPageRequest>({
            query: (pageRequest) => {
                return {
                    url: `/page`,
                    method: 'GET',
                    params: pageRequest
                }
            },
            providesTags: ["CategoriesPage"]
        }),

        getAllCategories: builder.query<ApiResponse<ICategory[]>, void>({
            query: () => {
                return {
                    url: `/list`,
                    method: 'GET',
                }
            },
            providesTags: ["Categories"]
        }),

        getCategoryById: builder.query<ICategory, number>({
            query: (categoryId) => {
                return {
                    url: `/${categoryId}`,
                    method: 'GET',
                }
            },
            providesTags: ["Category"]
        }),
        createCategory: builder.mutation<void, FormData>({
            query: (newCategory) => ({
                url: `/create`,
                method: 'POST',
                body: newCategory,
            }),
            invalidatesTags: ['Categories', 'CategoriesPage'],
        }),
        updateCategory: builder.mutation<void, FormData>({
            query: (updatedCategory) => ({
                url: `/update`,
                method: 'PUT',
                body: updatedCategory,
            }),
            invalidatesTags: ['Categories', 'CategoriesPage', 'Category'],
        }),
        deleteCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Categories', 'CategoriesPage'],
        }),
    }),
})

export const {
    useGetCategoryPageQuery,
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = apiCategory