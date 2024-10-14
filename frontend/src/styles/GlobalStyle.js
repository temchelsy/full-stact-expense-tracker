import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
    }

    :root {
        --primary-color: #222260;
        --primary-color2: rgba(34, 34, 96, .6);
        --primary-color3: rgba(34, 34, 96, .4);
        --color-green: #42AD00;
        --color-grey: #aaa;
        --color-accent: #F56692;
        --color-delete: #FF0000;
    }

    html, body {
        width: 100%;
        height: 100%;
        margin: 0;   
        padding: 0;  
        font-size: 16px;
        overflow-x: hidden;

        @media screen and (max-width: 768px) {
            font-size: 14px;
        }

        @media screen and (max-width: 480px) {
            font-size: 12px;
        }
    }

    body {
        font-family: 'Nunito', sans-serif;
        font-size: 1rem;
        color: var(--primary-color2);
        line-height: 1.5;
        display: flex;
        flex-direction: column;
        justify-content: center; 
        min-height: 100vh; 
        max-width:100vw
    }

    #root {
        flex-grow: 1; /* Makes the container flexible to fill space */
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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
        
        @media screen and (max-width: 768px) {
            margin-bottom: 0.75rem;
        }
    }

    .error {
        color: var(--color-delete);
        animation: shake 0.5s ease-in-out;

        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(10px); }
            50% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
            100% { transform: translateX(0); }
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
