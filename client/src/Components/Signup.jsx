import { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const nav = useNavigate();

  const submit = e => {
    e.preventDefault();
    setError('');

    Axios.post('http://localhost:3000/auth/signup',
      { username, email, password },
      { withCredentials: true }
    )
      .then(res => {
        if (res.data.status) {
          alert('Signup successful');
          nav('/login');
        } else setError(res.data.message);
      })
      .catch(err => {
        if (err.response?.status === 409) setError('User already exists');
        else setError('Signup failed');
      });
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={submit}>
        <h2>Sign Up</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <label>Username</label>
        <input onChange={e => setUsername(e.target.value)} />
        <label>Email</label>
        <input type="email" onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" onChange={e => setPassword(e.target.value)} />
        <button>Sign Up</button>
        <p>Have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
