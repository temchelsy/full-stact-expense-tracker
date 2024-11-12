import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OauthCallback.css';

const OauthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      navigate('/dashboard'); 
    } else {
      navigate('/login?error=auth_failed'); 
    }
  }, [location, navigate]);

  return (
    <div className="container">
      <div className="spinner"></div>
    </div>
  );
};

export default OauthCallback;
