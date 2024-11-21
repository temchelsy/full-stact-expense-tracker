import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OauthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      sessionStorage.setItem('authToken', token);
      setLoading(false);
      navigate('/dashboard'); // Redirect to dashboard on successful authentication
    } else {
      setLoading(false);
      setError('Authentication failed. No token found.');
      navigate('/login?error=auth_failed');
    }
  }, [location, navigate]);

  return (
    <div className="container">
      {loading && <div className="spinner">Authenticating...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};


export default OauthCallback;
