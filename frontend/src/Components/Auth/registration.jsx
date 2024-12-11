import React, { useState } from "react";
import './registration.css';
import { toast } from "sonner";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleAuth from './GoogleAuth';  // Import GoogleAuth component

export const Registration = ({ onAuthenticate, onFormSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Google login loading state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long.';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter.';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter.';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!firstName || !lastName) {
            setErrorMessage('First name and last name are required.');
            setIsLoading(false);
            return;
        }

        const passwordValidationMessage = validatePassword(password);
        if (passwordValidationMessage) {
            setErrorMessage(passwordValidationMessage);
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('https://full-stact-expense-tracker.onrender.com/api/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.error || 'An error occurred. Please try again.');
                setIsLoading(false);
                return;
            }

            const data = await response.json();

            localStorage.setItem('lastName', lastName);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            toast.success('Registration successful! Redirecting to login...');

            setTimeout(() => {
                onAuthenticate(true, '/'); 
            }, 1500);

        } catch (error) {
            toast.error('An error occurred. Please try again');
            console.error('Error:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true); // Start loader for Google login
        window.location.href = 'https://full-stact-expense-tracker.onrender.com/api/v1/google';
    };

    return (
        <div className="background-container">
            <div className="form-container">
                <h2>Register</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form className="register-form" onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        value={firstName}
                        name="firstName"
                        onChange={(e) => setFirstName(e.target.value)}
                        id="firstName"
                        placeholder="First Name"
                        required
                    />
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        value={lastName}
                        name="lastName"
                        onChange={(e) => setLastName(e.target.value)}
                        id="lastName"
                        placeholder="Last Name"
                        required
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="youremail@gmail.com"
                        id="email"
                        name="email"
                        required
                        disabled={isLoading || isGoogleLoading} // Disable during loading
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
                            disabled={isLoading || isGoogleLoading} // Disable during loading
                        />
                        <span
                            className="eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </span>
                    </div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="password-container">
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            id="confirmPassword"
                            name="confirmPassword"
                            required
                            disabled={isLoading || isGoogleLoading} // Disable during loading
                        />
                        <span
                            className="eye-icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </span>
                    </div>
                    <button type="submit" disabled={isLoading || isGoogleLoading}>
                        {isLoading ? (
                            <div className="spinner"></div> // Spinner for form submission
                        ) : (
                            'Register'
                        )}
                    </button>
                    {isLoading && <div className="loader"></div>}
                </form>
                <button className="link-btn" onClick={() => onFormSwitch('login')}>
                    Already have an account? Login here.
                </button>

                {/* Google Auth Button */}
                <GoogleAuth loading={isGoogleLoading} onClick={handleGoogleLogin} />
               
            </div>
        </div>
    );
};

export default Registration;
