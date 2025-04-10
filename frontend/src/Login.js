import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const Login = ({ API }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}login/`, credentials);
      if (response.data.tokens && response.data.tokens.access) {
        const accessToken = response.data.tokens.access;
        const refreshToken = response.data.tokens.refresh;
        const username = response.data.username;
        localStorage.setItem("username", username);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("accessToken", accessToken);
        navigate("/notes");
      } else {
        setError("Login failed. No access token received.");
      }
    } catch(error) {
      console.error("Login Error:", error.response ? error.response.data : error);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header>Login</header>    
      <main className="flex items-start justify-center flex-grow">
        <form onSubmit={handleLogin} aria-label="login" className="w-full max-w-md p-10 shadow-lg rounded-md">
          <h1 className="text-4xl font-bold text-center mb-5">Login</h1>
          {error && <p className="text-red-600">{error}</p>}
          <input 
            className="w-full p-3 mb-4 border border-stone-300 rounded-md"
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
          />
          <input
            className="w-full p-3 mb-4 border border-stone-300 rounded-md"
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
          <button className="w-full text-2xl p-3 rounded-md bg-blue-600 text-white cursor-pointer font-bold transition-all duration-300 hover:bg-blue-700 hover:shadow-md" type="submit">Login</button>
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 hover:underline text-sm mt-4"><FaArrowLeft className="mr-1" />Back to the homepage</Link>
        </form>
      </main>
      <footer>&#0169; 2025</footer>
    </div>
  );
}

export default Login;
