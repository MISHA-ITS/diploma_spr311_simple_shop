import {configureStore} from "@reduxjs/toolkit"
import {apiAccount} from "../services/apiAccount.ts";
import {apiUser} from "../services/apiUser.ts";
import authReducer from "./authSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {categoryApi} from "./api/categoryApi.ts";
import {advertisementApi} from "./api/advertisementApi.ts";

export const store = configureStore({
    reducer: {
        [categoryApi.reducerPath]: categoryApi.reducer,
        [apiAccount.reducerPath]: apiAccount.reducer,
        [apiUser.reducerPath]: apiUser.reducer,
        [advertisementApi.reducerPath]: advertisementApi.reducer,
        auth: authReducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            categoryApi.middleware,
            apiAccount.middleware,
            apiUser.middleware
        )
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
