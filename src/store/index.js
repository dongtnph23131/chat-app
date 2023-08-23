import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authApi from "../api/auth";

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
})
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware)
})
export default store