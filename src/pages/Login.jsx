import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Auth.css";
import { useAuth } from "../auth/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    // Scroll to top on mount to fix login page visibility issue
    window.scrollTo(0, 0);

    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use relative path so it works with the proxy
      const response = await fetch("/auth-api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          remember_me: rememberMe, // Pass remember me preference
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "❌ Login failed");
        return;
      }

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("username", form.username);

        login({
          username: form.username,
          token: "dummy-token",
        });

        toast.success("✅ Logged in successfully!");
        navigate("/"); // Redirect to home page after successful login
      } else {
        toast.error(data.message || "❌ Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("❌ Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Username
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
            disabled={loading}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
          />
          Remember me
        </label>
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
