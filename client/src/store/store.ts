import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// store
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

//types (VERY IMPORTANT for TS)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;