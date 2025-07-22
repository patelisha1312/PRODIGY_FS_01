import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get('http://localhost:3000/auth/verify', {
          withCredentials: true,
        });

        console.log('Verification response:', res);

        if (!res.data.status) {
          navigate('/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Verification failed:', error);
        navigate('/login');
      }
    };

    verifyUser();
  }, [navigate]);

  if (loading) return <div>Loading Dashboard...</div>;

  return (
    <div>
      <h2>Welcome to your Dashboard</h2>
      <p>You are successfully logged in.</p>
    </div>
  );
};

export default Dashboard;
