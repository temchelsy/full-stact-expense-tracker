
import React, { useState } from 'react';
import axios from 'axios';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://full-stact-expense-tracker.onrender.com/api/v1/forgot-password', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div className="background-container">
      <div className="form-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Submit</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
