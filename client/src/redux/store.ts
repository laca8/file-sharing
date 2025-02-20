import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slicers/userSlice";
import folderSlice from "./slicers/folderSlice";

const store = configureStore({
  reducer: {
    userSlice: userSlice,
    folderSlice: folderSlice,
  },
});
// Define the `AppDispatch` type from the store's dispatch function
export type AppDispatch = typeof store.dispatch;
// Define the `RootState` type from the store's state
export type RootState = ReturnType<typeof store.getState>;
export default store;
