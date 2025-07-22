import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout', { withCredentials: true })
      .then(res => {
        if (res.data.status) {
          navigate('/login');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <h2>Home</h2>
      <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button><br /><br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
