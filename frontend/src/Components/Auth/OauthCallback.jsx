import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OauthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');  // Retrieve token from URL query params

    if (token) {
      // Store the token securely (consider using localStorage)
      localStorage.setItem('authToken', token);

      setLoading(false);
      navigate('/dashboard');  // Redirect to dashboard after successful authentication
    } else {
      setLoading(false);
      setError('Authentication failed. No token found.');
      navigate('/login?error=auth_failed');  // Redirect to login page with error
    }
  }, [location, navigate]);

  return (
    <div>
      {loading && <p>Authenticating...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default OauthCallback;
