import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { toast } from 'sonner';

export const Login = ({ onAuthenticate, onFormSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!email || !password) {
            setErrorMessage('Email and password are required');
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
                
                // Log the entire response to check for the token
                console.log('Server Response:', data);
                
                if (data.token) {
                    // setSuccessMessage('Login successful!');
                    toast.success('login successful')

                    // Store the token in localStorage
                    localStorage.setItem('token', data.token);

                    // Handle "Remember Me" logic
                    if (rememberMe) {
                        localStorage.setItem('email', email);
                    } else {
                        localStorage.removeItem('email');
                    }

                    // Call authentication handler and navigate to home
                    onAuthenticate(true, '/');
                } else {
                    setErrorMessage('Login successful, but no token received. Please try again.');
                }

            } else {
                const errorData = await response.json();
                // setErrorMessage(errorData.error || 'Login failed. Please try again.');
                
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
            console.error('Error:', error.message);
            toast.error('login failed')
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="background-container">
            <div className="form-container">
                <h2>Login</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
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
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="password"
                        id="password"
                        name="password"
                        required
                    />
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
                    {isLoading && <div className="loader"></div>}
                </form>
                <button className="link-btn" onClick={() => onFormSwitch('register')}>
                    Don't have an account? Register here.
                </button>
            </div>
        </div>
    );
};

export default Login;
