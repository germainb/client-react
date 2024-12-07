import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  threads: [],
  loading: false,
  error: null,
};

const threadSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    setThreads: (state, action) => {
      state.threads = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateThread: (state, action) => {
        const updatedThread = action.payload;
        state.threads = state.threads.map((thread) =>
          thread._id === updatedThread._id ? updatedThread : thread
        );
      },
  },
});

export const { setThreads, setLoading, setError, updateThread } = threadSlice.actions;

export default threadSlice.reducer;
