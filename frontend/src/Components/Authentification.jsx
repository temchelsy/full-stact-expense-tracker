import React from 'react';
import { Login } from './Login'; // Adjust the path as necessary

const Authentification = ({ onAuthenticate }) => {
    const handleFormSwitch = (formType) => {
        // Logic to handle form switching (if needed)
        console.log(`Switching form to: ${formType}`);
    };

    return (
        <Login onAuthenticate={onAuthenticate} onFormSwitch={handleFormSwitch} />
    );
};

export default Authentification;
