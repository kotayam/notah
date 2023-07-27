import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false
    })
})
