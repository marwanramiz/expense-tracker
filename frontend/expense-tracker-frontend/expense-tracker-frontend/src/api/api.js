import axios from "axios";

// Base URL of the Spring Boot backend (marwanramiz/expense-tracker).
// Override with REACT_APP_API_BASE_URL in a .env file if the backend
// runs somewhere other than localhost:8080.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: "https://expense-tracker-7xlg.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a token is expired/invalid, the backend's JwtFilter will reject the
// request (401/403). Clear local session so the app returns to /login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
    }
    return Promise.reject(error);
  }
);

/**
 * POST /auth/register
 * Body: { username, password }
 */
export const registerUser = (username, password) =>
  api.post("/auth/register", { username, password });

/**
 * POST /auth/login
 * Body: { username, password }
 * NOTE: the backend returns the raw signed JWT string on success
 * (not a JSON object), so we normalize whatever comes back to a plain string.
 */
export const loginUser = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  const data = response.data;
  const token = typeof data === "string" ? data : data?.token || data?.jwt;
  return token;
};

/**
 * POST /api/expenses (JWT required)
 * Body: { userId, amount, category, date, description }
 */
export const addExpense = (expense) => api.post("/api/expenses", expense);

/**
 * GET /api/expenses/{userId} (JWT required)
 */
export const getExpenses = (userId) => api.get(`/api/expenses/${userId}`);

export default api;
