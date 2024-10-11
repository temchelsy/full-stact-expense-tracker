import React, { useState } from 'react';
import { Login } from './login';
import { Registration } from './registration';

export default function Authentification({ onAuthenticate }) {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <div className="App">
      {
        currentForm === "login" 
          ? <Login onAuthenticate={onAuthenticate} onFormSwitch={toggleForm} /> 
          : <Registration onAuthenticate={onAuthenticate} onFormSwitch={toggleForm} />
      }
    </div>
  );
}