import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    /* Importing Roboto font */
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
    }

    :root {
        --primary-color: #1E2A38; /* Darker, modern blue-grey */
        --primary-color2: rgba(30, 42, 56, 0.8); /* Softer primary color for subtle text */
        --primary-color3: rgba(30, 42, 56, 0.6); /* Lighter shade for low emphasis */
        --color-green: #42AD00; /* Retain for positive balances */
        --color-grey: #d3d6db; /* Light grey for backgrounds */
        --color-accent: #FF8A80; /* Softer pink for action highlights */
        --color-delete: #D32F2F; /* Muted red for delete or error actions */
    }

    html, body {
        width: 100%;
        height: 100%;
        margin: 0;   
        padding: 0;  
        font-size: 16px;
        font-family: 'Roboto', sans-serif;
        overflow-x: hidden;

        @media screen and (max-width: 768px) {
            font-size: 14px;
        }

        @media screen and (max-width: 480px) {
            font-size: 12px;
        }
    }

    body {
        font-size: 1rem;
        color: var(--primary-color2);
        line-height: 1.5;
        display: flex;
        flex-direction: column;
        justify-content: center; 
        min-height: 100vh; 
        max-width: 100vw;
        font-family: 'Roboto', sans-serif;
        background-color: var(--color-grey);
    }
        
    #root {
        flex-grow: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1rem;

        @media screen and (max-width: 768px) {
            padding: 0.75rem;
        }

        @media screen and (max-width: 480px) {
            padding: 0.5rem;
        }
    }

    h1, h2, h3, h4, h5, h6 {
        color: var(--primary-color);
        margin-bottom: 1rem;
    }

    h1 { font-size: 2.5rem; }
    h2 { font-size: 2rem; }
    h3 { font-size: 1.75rem; }
    h4 { font-size: 1.5rem; }
    h5 { font-size: 1.25rem; }
    h6 { font-size: 1rem; }

    @media screen and (max-width: 768px) {
        h1 { font-size: 2.2rem; }
        h2 { font-size: 1.8rem; }
        h3 { font-size: 1.6rem; }
        h4 { font-size: 1.4rem; }
        h5 { font-size: 1.2rem; }
        h6 { font-size: 1rem; }
    }

    @media screen and (max-width: 480px) {
        h1 { font-size: 2rem; }
        h2 { font-size: 1.7rem; }
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.3rem; }
        h5 { font-size: 1.1rem; }
        h6 { font-size: 1rem; }
    }

    p {
        margin-bottom: 1rem;
        font-size: 1rem;
        
        @media screen and (max-width: 768px) {
            margin-bottom: 0.75rem;
            font-size: 0.95rem;
        }

        @media screen and (max-width: 480px) {
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }
    }

    .error {
        color: var(--color-delete);
        font-size: 0.9rem;
        animation: shake 0.5s ease-in-out;

        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(10px); }
            50% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
            100% { transform: translateX(0); }
        }

        @media screen and (max-width: 768px) {
            font-size: 0.85rem;
        }

        @media screen and (max-width: 480px) {
            font-size: 0.8rem;
        }
    }

    @media screen and (max-width: 768px) {
        .hide-on-mobile {
            display: none;
        }
    }

    @media screen and (max-width: 480px) {
        .hide-on-small {
            display: none;
        }
    }
`;
