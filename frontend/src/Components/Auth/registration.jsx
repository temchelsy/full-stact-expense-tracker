import React, { useState } from "react";
import './registration.css';
import { toast } from "sonner";

export const Registration = ({ onAuthenticate, onFormSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

        // Check for required fields
        if (!firstName || !lastName) {
            setErrorMessage('First name and last name are required.');
            setIsLoading(false);
            return;
        }

        // Validate password
        const passwordValidationMessage = validatePassword(password);
        if (passwordValidationMessage) {
            setErrorMessage(passwordValidationMessage);
            setIsLoading(false);
            return;
        }

        // Confirm passwords match
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            // Send registration data to the API
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

            // Store lastName in localStorage for future use
            localStorage.setItem('lastName', lastName);
            
          
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            // Show success message and proceed to authenticate
            // setSuccessMessage('Registration successful! Redirecting to login...');
            toast.success('Registration successful! Redirecting to login...')

            setTimeout(() => {
                onAuthenticate(true, '/'); 
            }, 1500); // Redirect after 1.5 seconds

        } catch (error) {
            // setErrorMessage('An error occurred. Please try again.');
            toast.error('An error occurred. Please try again')
            console.error('Error:', error.message);
        } finally {
            setIsLoading(false);
        }
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
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        id="password"
                        name="password"
                        required
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        placeholder="Confirm Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                    {isLoading && <div className="loader"></div>}
                </form>
                <button className="link-btn" onClick={() => onFormSwitch('login')}>
                    Already have an account? Login here.
                </button>
            </div>
        </div>
    );
};

export default Registration;
