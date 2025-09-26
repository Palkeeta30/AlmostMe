import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start by verifying with backend
    const checkAuthStatus = async () => {
      try {
        const response = await apiClient.request("/auth-api/current_user/", {
          method: "GET",
        });

        if (response.data.success) {
          setIsAuthenticated(true);
          setUser({
            username: response.data.username,
            email: response.data.email,
          });
          localStorage.setItem("username", response.data.username);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("username");
        }
      } catch (error) {
        // If backend is not available or user not authenticated, clear local state
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("username");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Session refresh mechanism to prevent daily login issues
  useEffect(() => {
    if (!isAuthenticated) return;

    // Refresh session every 24 hours to prevent expiration
    const sessionRefreshInterval = setInterval(async () => {
      try {
        const response = await apiClient.request("/auth-api/refresh_session/", {
          method: "POST",
        });

        if (!response.data.success) {
          // If session refresh fails, user might need to log in again
          console.warn("Session refresh failed, user may need to log in again");
        }
      } catch (error) {
        console.warn("Session refresh error:", error);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearInterval(sessionRefreshInterval);
  }, [isAuthenticated]);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("username", userData.username);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("username");
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
