import React, { useState } from "react";
import './registration.css';

export const Registration = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Function to validate password strength
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

        // Validate first name, last name, and password
        if (!firstName || !lastName) {
            setErrorMessage('First name and last name are required.');
            return;
        }

        const passwordValidationMessage = validatePassword(password);
        if (passwordValidationMessage) {
            setErrorMessage(passwordValidationMessage);
            return;
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
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
                return;
            }

            setSuccessMessage('Registration successful! You can now log in.');
            
            // Call onAuthenticate to update authentication state in App.js
            props.onAuthenticate(true);
            
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
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
                    <button type="submit">Register</button>
                </form>
                <button className="link-btn" onClick={() => props.onFormSwitch('login')}>
                    Already have an account? Login here.
                </button>
            </div>
        </div>
    );
};
export default Registration