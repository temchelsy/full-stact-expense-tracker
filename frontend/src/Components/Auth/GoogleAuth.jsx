import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import './GoogleAuth.css';

const GoogleAuth = ({ loading, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="button"
      disabled={loading}
    >
      <FcGoogle className={`icon ${loading ? 'loading' : ''}`} />
      {loading ? 'Loading...' : 'Login with Google'}
    </button>
  );
};

export default GoogleAuth;
