import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { toast } from 'sonner';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleAuth from './GoogleAuth';

export const Login = ({ onAuthenticate, onFormSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email || !password) {
            toast.error('Email and password are required');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('https://full-stact-expense-tracker.onrender.com/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.token) {
                    toast.success('Login successful!');
                    localStorage.setItem('token', data.token);

                    if (rememberMe) {
                        localStorage.setItem('email', email);
                    } else {
                        localStorage.removeItem('email');
                    }

                    onAuthenticate(true, '/');
                } else {
                    toast.error('Login successful, but no token received.');
                }
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Redirect to the Google OAuth endpoint without triggering inline CSP issues
        window.location.href = 'https://full-stact-expense-tracker.onrender.com/api/v1/google';
    };

    return (
        <div className="background-container">
            <div className="form-container">
                <h2>Login to Expense Ease</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="youremail@gmail.com"
                        id="email"
                        name="email"
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <div className="password-container">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            id="password"
                            name="password"
                            required
                        />
                        <span
                            className="eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </span>
                    </div>
                    <div className="remember-me">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        <label htmlFor="rememberMe">Remember Me</label>
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <button className="link-btn" onClick={() => onFormSwitch('register')}>
                    Don't have an account? Register here.
                </button>
                <button
                    className="link-btn"
                    onClick={() => navigate('/forgot-password')}
                >
                    Forgot Password?
                </button>

                {/* Google login button */}
                <button className="google-login-btn" onClick={handleGoogleLogin}>
                    Login with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
