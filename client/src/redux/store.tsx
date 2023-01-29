import { configureStore } from '@reduxjs/toolkit';
import loaderSlice from './loaderSlice';
import { userReducer } from './usersSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    loader: loaderSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
