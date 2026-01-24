import {configureStore} from "@reduxjs/toolkit"
import {apiAccount} from "../services/apiAccount.ts";
import {apiUser} from "../services/apiUser.ts";
import authReducer from "./authSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const store = configureStore({
    reducer: {
        [apiAccount.reducerPath]: apiAccount.reducer,
        [apiUser.reducerPath]: apiUser.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiAccount.middleware,
            apiUser.middleware
        )
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
