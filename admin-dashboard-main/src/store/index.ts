import {configureStore} from "@reduxjs/toolkit"
import {apiAccount} from "../services/apiAccount.ts";
import {apiUser} from "../services/apiUser.ts";
import authReducer from "./authSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {apiCategory} from "../services/apiCategory.ts";
import {apiAdvertisement} from "../services/apiAdvertisement.ts";
import {apiNewPost} from "../services/apiNewPost.ts";
import {apiOrder} from "../services/apiOrder.ts";
//import {advertisementApi} from "./api/advertisementApi.ts";

export const store = configureStore({
    reducer: {
        [apiCategory.reducerPath]: apiCategory.reducer,
        [apiAccount.reducerPath]: apiAccount.reducer,
        [apiUser.reducerPath]: apiUser.reducer,
        [apiAdvertisement.reducerPath]: apiAdvertisement.reducer,
        [apiNewPost.reducerPath]: apiNewPost.reducer,
        [apiOrder.reducerPath]: apiOrder.reducer,
        //[advertisementApi.reducerPath]: advertisementApi.reducer,
        auth: authReducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiCategory.middleware,
            apiAccount.middleware,
            apiUser.middleware,
            apiAdvertisement.middleware,
            apiNewPost.middleware,
            apiOrder.middleware,
            //advertisementApi.middleware
        )
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
