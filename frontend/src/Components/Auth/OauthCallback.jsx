import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast'; 

const OauthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      try {
        // Optional: Validate token structure
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format');
        }

        sessionStorage.setItem('authToken', token);
        toast.success('Login Successful'); // Optional toast notification
        setLoading(false);
        navigate('/dashboard');
      } catch (err) {
        console.error('Token validation error:', err);
        setError('Authentication failed: Invalid token');
        toast.error('Login Failed'); // Optional toast notification
        navigate('/login', { 
          state: { error: 'Invalid authentication token' } 
        });
      }
    } else {
      setLoading(false);
      setError('Authentication failed: No token found');
      toast.error('Login Failed'); // Optional toast notification
      navigate('/login', { 
        state: { error: 'No authentication token received' } 
      });
    }
  }, [location, navigate]);

  // Optional: More informative loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border" role="status">
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  // Optional: Error display
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return null;
};

export default OauthCallback;