import { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = e => {
    e.preventDefault();
    setError('');

    Axios.post('http://localhost:3000/auth/forgotPassword',
      { email },
      { withCredentials: true }
    )
      .then(res => {
        if (res.data.status) {
          alert('Check your email for a reset link');
          nav('/login');
        } else setError(res.data.message);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Request failed');
      });
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={submit}>
        <h2>Forgot Password</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <label>Email</label>
        <input type="email" onChange={e => setEmail(e.target.value)} />
        <button>Send</button>
      </form>
    </div>
  );
}
