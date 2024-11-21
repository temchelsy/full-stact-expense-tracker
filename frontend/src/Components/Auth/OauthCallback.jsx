import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OauthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      sessionStorage.setItem('authToken', token); // Store token in sessionStorage
      setLoading(false);
      navigate('/dashboard'); // Redirect to dashboard or any other page
    } else {
      setLoading(false);
      setError('Authentication failed: No token found.');
      navigate('/login?error=auth_failed');
    }
  }, [location, navigate]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
    </div>
  );
};


export default OauthCallback;
