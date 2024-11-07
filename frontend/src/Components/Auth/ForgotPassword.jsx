import React, { useState } from 'react';
import { toast } from 'sonner';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!email) {
            setMessage('Please enter your email address.');
            return;
        }

        try {
            const response = await fetch('https://full-stact-expense-tracker.onrender.com/api/v1/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage('Password reset link sent to your email.');
                toast.success('Password reset email sent!');
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'Failed to send password reset email.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            toast.error('Failed to send password reset email.');
        }
    };

    return (
        <div className="form-container">
            <h2>Forgot Password</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleForgotPassword}>
                <label htmlFor="email">Enter your email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@gmail.com"
                    required
                />
                <button type="submit">Send Password Reset Link</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
