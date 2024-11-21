import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import './GoogleAuth.css';

const GoogleAuth = ({ loading, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="button"
      disabled={loading}
      aria-label={loading ? 'Logging in with Google...' : 'Continue with Google'}
    >
      <FcGoogle className={`icon ${loading ? 'loading' : ''}`} />
      {loading ? <span className="spinner"></span> : 'Login with Google'}
    </button>
  );
};

export default GoogleAuth;
