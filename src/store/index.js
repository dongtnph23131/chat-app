import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authApi from "../api/auth";
import userApi from "../api/user";

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]:userApi.reducer
})
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware).concat(userApi.middleware)
})
export default store