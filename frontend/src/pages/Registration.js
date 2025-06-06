import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../hooks/api';
import { AuthContext } from '../context/AuthContext';

const Registration = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegistration = async(e) => {
    e.preventDefault();
    try {
      await api.post(`register/`, {
        username: username, email: email, password: password, password2: password2
      });
      try {
        const loginResponse = await api.post(`login/`, {username, password})
        if (loginResponse.data.access_token) {
          const username = loginResponse.data.username;
          localStorage.setItem("username", username);
          setIsAuthenticated(true);
          navigate("/notes/");
        } else {
          setError("Login failed. No access token received.");
        }
      } catch(error) {
        console.error("Login Error:", error.response ? error.response.data : error);
        setError("Invalid username or password");
      }
    } catch(error) {
      console.error("Registration Error:", error.response ? error.response.data : error);
      setError("Invalid data");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header>Registration</header>
      <main className="flex items-start flex-grow justify-center">
        <form onSubmit={handleRegistration} aria-label="registration" className="w-full max-w-md p-10 shadow-lg rounded-md">
          <h1 className="text-4xl font-bold text-center mb-5">Registration</h1>
          {error && <p className="text-red-600">{error}</p>}
          <h2 className="text-2xl font-bold mb-3">Username:</h2>
          <input 
            className="w-full p-3 mb-4 border border-stone-300 rounded-md"
            type="text"
            name="username"
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <h2 className="text-2xl font-bold mb-3">Email:</h2>
          <input 
            className="w-full p-3 mb-4 border border-stone-300 rounded-md"
            type="text" 
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h2 className="text-2xl font-bold mb-3">Password:</h2>
          <input 
            className="w-full p-3 mb-4 border border-stone-300 rounded-md"
            type="password" 
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <h2 className="text-2xl font-bold mb-3">Repeat password:</h2>
          <input 
            className="w-full p-3 mb-4 border border-stone-300 rounded-md"
            type="password" 
            name="password2"
            placeholder="Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <button type="submit" className="w-full text-2xl p-3 rounded-md bg-blue-600 text-white cursor-pointer font-bold transition-all duration-300 hover:bg-blue-700 hover:shadow-md">Register</button>
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 hover:underline text-sm mt-4"><FaArrowLeft className="mr-1" />Back to the homepage</Link>
        </form>
      </main>
      <footer>&#0169; 2025</footer>
    </div>
  )
}

export default Registration