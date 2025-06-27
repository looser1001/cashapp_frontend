import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/style.css";
import BASE_URL from "./config";

axios.get(`${BASE_URL}/api/data`);
axios.post(`${BASE_URL}/api/click`, data);


const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("https://node-server-js-k66j.onrender.com/api/admin/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.success) {
      navigate('/admin-dashboard'); // Redirect to dashboard
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default AdminLogin;
