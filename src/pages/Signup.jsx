import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { apiClient } from "../utils/api";
import "./Auth.css";
import { useAuth } from "../auth/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Scroll to top on mount to fix signup page visibility issue
    window.scrollTo(0, 0);
  }, []);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 8) return "Too short";
    if (!/(?=.*[a-z])/.test(password)) return "Needs lowercase";
    if (!/(?=.*[A-Z])/.test(password)) return "Needs uppercase";
    if (!/(?=.*\d)/.test(password)) return "Needs number";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "Needs symbol";
    return "Strong";
  };

  const generateStrongPassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";

    let password = "";
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
    setForm((prev) => ({ ...prev, password, password_confirm: password }));
    setPasswordStrength("Strong");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation for confirm password
    if (form.password !== form.password_confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Signup request (CSRF not needed as endpoint is @csrf_exempt)
      const signupResponse = await apiClient.request("/auth-api/signup/", {
        method: "POST",
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      if (!signupResponse.ok || !signupResponse.data?.success) {
        console.error("Signup failed response:", signupResponse);
        toast.error(
          signupResponse.message ||
            signupResponse.data?.message ||
            "Signup failed"
        );
        setLoading(false);
        return;
      }

      // Auto login after signup
      // Removed login API call after signup because user is already logged in on backend
      /*
      const loginResponse = await apiClient.request(
        "http://localhost:8000/auth-api/login/",
        {
          method: "POST",
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        }
      );

      if (!loginResponse.data.success) {
        toast.error("Login after signup failed");
        setLoading(false);
        return;
      }
      */

      // Save username in localStorage (token handling can be added if JWT is used)
      localStorage.setItem("username", form.username);

      login({
        username: form.username,
      });

      toast.success("🎉 Account created and logged in!");
      navigate("/"); // Redirect to home page after successful signup and login
      // Removed onSignupSuccess call to fix undefined error
      // if (typeof onSignupSuccess === "function") onSignupSuccess();
    } catch (err) {
      console.error("Signup error:", err);
      let msg = "Signup failed";

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          msg = err.response.data;
        } else if (err.response.data.detail) {
          msg = err.response.data.detail;
        } else {
          // Collect all field errors from Django REST Framework or Django JSON response
          msg = Object.entries(err.response.data)
            .map(([key, val]) => `${key}: ${val}`)
            .join(", ");
        }
      }

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {form.password && (
            <div
              className={`password-strength ${passwordStrength.toLowerCase()}`}
            >
              Password strength: {passwordStrength}
            </div>
          )}
          <button
            type="button"
            onClick={generateStrongPassword}
            className="generate-password-btn"
            style={{
              marginTop: "5px",
              padding: "5px 10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Generate Strong Password
          </button>
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            name="password_confirm"
            value={form.password_confirm}
            onChange={handleChange}
            required
          />
        </label>
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
