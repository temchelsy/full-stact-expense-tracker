import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import bg from './img/bg.png';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import { useGlobalContext } from './context/globalContext';
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import Authentification from './Components/Auth/auth';

function App() {
    const [active, setActive] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if the user is authenticated
    const navigate = useNavigate();
    
    const global = useGlobalContext();
    console.log(global);

    const orbMemo = useMemo(() => <Orb />, []);

    // Check if the user is authenticated based on the presence of a token in localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true); // Automatically set authenticated if token exists
        } else {
            setIsAuthenticated(false); // If no token, the user is logged out
        }
    }, []);

    // Function to handle authentication and navigation
    const handleAuthentication = (authStatus, redirectPath = '/') => {
        setIsAuthenticated(authStatus);
        if (authStatus) {
            navigate(redirectPath);  // Navigate to dashboard if login is successful
        }
    };

    return (
        <AppStyled bg={bg} className="App">
            {orbMemo}
            <MainLayout>
                {isAuthenticated ? (
                    <>
                        <Navigation active={active} setActive={setActive} />
                        <main>
                            <nav>
                                <ul>
                                    <li><Link to="/">Dashboard</Link></li>
                                    <li><Link to="/income">Income</Link></li>
                                    <li><Link to="/expenses">Expenses</Link></li>
                                </ul>
                            </nav>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/income" element={<Income />} />
                                <Route path="/expenses" element={<Expenses />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </main>
                    </>
                ) : (
                    <Routes>
                        <Route path="*" element={<Authentification onAuthenticate={handleAuthentication} />} />
                    </Routes>
                )}
            </MainLayout>
        </AppStyled>
    );
}

const AppStyled = styled.div`
    height: 100vh;
    background-image: url(${(props) => props.bg});
    
    main {
        flex: 1;
        background: rgba(252, 246, 249, 0.78);
        border: 3px solid #FFFFFF;
        backdrop-filter: blur(4.5px);
        border-radius: 32px;
        overflow-x: hidden;
        &::-webkit-scrollbar {
            width: 0;
        }
    }
    nav {
        padding: 1rem;
        ul {
            display: flex;
            justify-content: space-around;
            list-style-type: none;
            li {
                a {
                    text-decoration: none;
                    color: #222260;
                    font-weight: 500;
                    &:hover {
                        color: #007bff;
                    }
                }
            }
        }
    }
`;

export default App;
