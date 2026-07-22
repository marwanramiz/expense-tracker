import React, { createContext, useContext, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [username, setUsername] = useState(() => localStorage.getItem("username"));
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const persistSession = (jwt, uname) => {
    // NOTE: the backend's /auth/login only returns a signed JWT string,
    // not a user id. We decode the token's "sub" claim (the username the
    // JwtUtil signs the token with) and use it as the userId for scoping
    // expense requests. If your JwtUtil embeds the Mongo _id instead of
    // the username as the subject, this will already line up with
    // GET /api/expenses/{userId}; otherwise adjust the claim name below.
    let resolvedId = uname;
    try {
      const decoded = jwtDecode(jwt);
      resolvedId = decoded.sub || decoded.userId || decoded.id || uname;
    } catch (e) {
      // If decoding fails, fall back to the username typed at login.
      resolvedId = uname;
    }

    localStorage.setItem("token", jwt);
    localStorage.setItem("userId", resolvedId);
    localStorage.setItem("username", uname);

    setToken(jwt);
    setUserId(resolvedId);
    setUsername(uname);
  };

  const login = useCallback(async (uname, password) => {
    setLoading(true);
    setAuthError("");
    try {
      const jwt = await loginUser(uname, password);
      if (!jwt) throw new Error("No token received from server.");
      persistSession(jwt, uname);
      return true;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Invalid username or password.";
      setAuthError(typeof message === "string" ? message : "Login failed.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (uname, password) => {
    setLoading(true);
    setAuthError("");
    try {
      await registerUser(uname, password);
      return true;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Registration failed. Try a different username.";
      setAuthError(typeof message === "string" ? message : "Registration failed.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setToken(null);
    setUserId(null);
    setUsername(null);
  }, []);

  const value = {
    token,
    userId,
    username,
    isAuthenticated: Boolean(token),
    authError,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthContext;
