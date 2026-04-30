// src/api/axios.js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api", // Your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token from localStorage to Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: response interceptor to handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login if unauthorized
    }
    return Promise.reject(error);
  }
);
// Book management functions - matching your backend routes
export const getAllBooks = async () => {
  const response = await api.get("/livres") // GET /api/livres (no auth required)
  return response.data
}

export const deleteBook = async (bookId) => {
  const response = await api.delete(`/livres/${bookId}`) // DELETE /api/livres/:id (requires employe or admin)
  return response.data
}

export const getBookById = async (bookId) => {
  const response = await api.get(`/livres/${bookId}`) // GET /api/livres/:id (no auth required)
  return response.data
}

export const updateBook = async (bookId, bookData) => {
  const response = await api.put(`/livres/${bookId}`, bookData) // PUT /api/livres/:id (requires employe or admin)
  return response.data
}

export const createBook = async (bookData) => {
  const response = await api.post("/livres", bookData) // POST /api/livres (requires employe or admin)
  return response.data
}

