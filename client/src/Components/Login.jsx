import { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await Axios.post(
        'http://localhost:3000/auth/login',
        { email, password },
        { withCredentials: true }
      );

      console.log('Login response:', res);

      if (res.data.status) {
        alert('Login successful!');
        navigate('/dashboard'); 
      } else {
        setError(res.data.message || 'Login failed');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Try again.');
    }

    setLoading(false);
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <label>Email:</label>
        <input type="email" required onChange={e => setEmail(e.target.value)} />

        <label>Password:</label>
        <input type="password" required onChange={e => setPassword(e.target.value)} />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={{ marginTop: '10px' }}>
          <Link to="/forgotPassword">Forgot Password?</Link>
          <p>Don’t have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </form>
    </div>
  );
}
