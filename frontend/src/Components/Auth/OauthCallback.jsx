import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const OauthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      try {
        // Save token for authentication
        localStorage.setItem("authToken", token);

        // Show success message
        toast.success("Login Successful");

        // Redirect to dashboard
        setLoading(false);
        navigate("/dashboard");
      } catch (err) {
        console.error("Token processing error:", err);
        toast.error("Authentication failed. Please try again.");
        setLoading(false);
        navigate("/login");
      }
    } else {
      toast.error("Authentication failed: No token found");
      setLoading(false);
      navigate("/login"); // Redirect to login if no token
    }
  }, [location, navigate]);

  // Show loading state while processing
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border" role="status">
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  return null;
};

export default OauthCallback;
