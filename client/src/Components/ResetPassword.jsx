import { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const nav = useNavigate();

  const submit = e => {
    e.preventDefault();
    setError('');

    Axios.post(`http://localhost:3000/auth/resetPassword/${token}`,
      { password },
      { withCredentials: true }
    )
      .then(res => {
        if (res.data.status) nav('/login');
        else setError(res.data.message);
        console.log(res.data);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Request failed');
      });
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={submit}>
        <h2>Reset Password</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <label>New Password</label>
        <input type="password" onChange={e => setPassword(e.target.value)} />
        <button>Reset</button>
      </form>
    </div>
  );
}
