// src/services/authService.js

import axios from "axios";

const API_URL = "https://serveur-react.vercel.app"; // Replace with your backend URL

// Set up Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Add a request interceptor to attach the token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("interceptor token:" + token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Register user
const register = async (userData) => {
  const response = await axiosInstance.post("api/auth/register", userData, {
    
    headers: {
      "Content-Type": "multipart/form-data", // Override the Content-Type header
    },
    
  });
  return response.data
};

// Login user
const login = async (userData) => {
  const response = await axiosInstance.post("api/auth/login", userData);
  return response.data;
};

// Example function to get user profile (for logged-in user)
const getProfile = async () => {
  const response = await axiosInstance.get("api/auth/profile");
  return response.data;
};

// Fetch all threads
const getThreads = async () => {
    const response = await axiosInstance.get("api/threads");
    return response.data;
};

// Handle get author
export const getUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`api/auth/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error getting author");
  }
};

// Handle liking a thread
export const likeThread = async (threadId) => {
    try {
      const response = await axiosInstance.post(`/api/threads/${threadId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error liking thread");
    }
  };
  
  // Async method to handle disliking a thread
  export const dislikeThread = async (threadId) => {
    try {
      const response = await axiosInstance.post(`/api/threads/${threadId}/dislike`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error disliking thread");
    }
  };

  // Create a new thread
 const createThread = async (threadData) => {
  try {
    const response = await axiosInstance.post("api/threads", threadData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error creating thread");
  }
};

// Delete a thread
const deleteThread = async (threadId) => {
  try {
    const response = await axiosInstance.delete(`api/threads/${threadId}`);
    return response.data; // Return the response data (optional, based on what your backend sends)
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting thread");
  }
};

export { register, login, getProfile, getThreads, createThread, deleteThread };
