import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  return (
    <div className="auth">
      <Login />
      <Register />
    </div>
  );
};

const Login = () => {
  const [loading, setLoading] = useState(false); // State variable to track loading state
  const [_, setCookies] = useCookies(["access_token"]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true when the login process starts

    if (!username || !password) {
      setError("Please enter both username and password.");
      setLoading(false); // Reset loading state
      return;
    }

    try {
      const result = await axios.post("https://server-578r.onrender.com/auth/login", {
        username,
        password,
      });

      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Invalid username or password.");
    } finally {
      setLoading(false); // Reset loading state after login process completes
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {loading ? (
          <div>Loading...</div> // Display loading screen while loading is true
        ) : (
          <button className="auth-btn" type="submit">Login</button>
        )}
      </form>
    </div>
  );
};


const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      await axios.post("https://server-578r.onrender.com/auth/register", {
        username,
        password,
      });
      alert("Registration Completed! Now login.");
    } catch (error) {
      console.error(error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button className="auth-btn" type="submit">Register</button>
      </form>
    </div>
  );
};
