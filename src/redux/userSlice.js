// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: (localStorage.getItem('token') == 'undefined' ? null : localStorage.getItem('token'))   || null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token); // Store token in localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token'); // Clear token on logout
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, setLoading, setError, logout } = userSlice.actions;

export default userSlice.reducer;
