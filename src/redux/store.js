// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';  // The slice for managing user data
import threadSlice from './threadSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    threads: threadSlice,
  },
});
