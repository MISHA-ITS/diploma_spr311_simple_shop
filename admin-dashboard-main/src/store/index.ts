import {configureStore} from "@reduxjs/toolkit"
import {apiAccount} from "../services/apiAccount.ts";
import {apiUser} from "../services/apiUser.ts";
import authReducer from "./authSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {apiCategory} from "../services/apiCategory.ts";
import {apiAdvertisement} from "../services/apiAdvertisement.ts";

export const store = configureStore({
    reducer: {
        [apiCategory.reducerPath]: apiCategory.reducer,
        [apiAccount.reducerPath]: apiAccount.reducer,
        [apiUser.reducerPath]: apiUser.reducer,
        [apiAdvertisement.reducerPath]: apiAdvertisement.reducer,
        auth: authReducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiCategory.middleware,
            apiAccount.middleware,
            apiUser.middleware,
            apiAdvertisement.middleware,
        )
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
