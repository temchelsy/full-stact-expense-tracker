import React, { useState, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import './GoogleAuth.css';

const GoogleAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Add logic here if you need to redirect after login or based on a condition.
  }, [navigate]);

  const handleGoogleLogin = () => {
    setLoading(true);
    try {
      window.location.href = 'https://full-stact-expense-tracker.onrender.com/api/v1/google/'; 
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="container">
      <button
        onClick={handleGoogleLogin}
        className="button"
        disabled={loading}
      >
        <FcGoogle className={`icon ${loading ? 'loading' : ''}`} />
        {loading ? 'Loading...' : 'Login with Google'}
      </button>
    </div>
  );
};

export default GoogleAuth;
