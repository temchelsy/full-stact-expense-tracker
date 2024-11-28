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
        // Save token for authentication
        localStorage.setItem('authToken', token);
  
        // Show success message and redirect
        toast.success('Login Successful');
        navigate('/dashboard'); // Redirect to dashboard
      } catch (err) {
        console.error('Token processing error:', err);
        toast.error('Authentication failed. Please try again.');
        navigate('/login'); // Redirect to login on error
      }
    } else {
      toast.error('Authentication failed: No token found');
      navigate('/login'); // Redirect to login if no token
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