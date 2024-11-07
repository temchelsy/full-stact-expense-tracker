import React, { useState } from 'react';
import { Login } from './login';
import { Registration } from './registration';
import ForgotPassword from './ForgotPassword';

export default function Authentification({ onAuthenticate }) {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <div className="App">
      {currentForm === "login" && (
        <Login onAuthenticate={onAuthenticate} onFormSwitch={toggleForm} />
      )}
      {currentForm === "register" && (
        <Registration onAuthenticate={onAuthenticate} onFormSwitch={toggleForm} />
      )}
      {currentForm === "forgotPassword" && (
        <ForgotPassword onFormSwitch={toggleForm} />
      )}
    </div>
  );
}
