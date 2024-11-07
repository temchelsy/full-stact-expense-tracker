import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MainLayout } from './styles/Layouts';
import { Toaster } from 'sonner';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import TransactionView from './Components/transaction';
import { useGlobalContext } from './context/globalContext';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Authentification from './Components/Auth/auth';
import ForgotPassword from './Components/Auth/ForgotPassword';

function App() {
    const [active, setActive] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const global = useGlobalContext();
    console.log(global);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleAuthentication = (authStatus, redirectPath = '/') => {
        setIsAuthenticated(authStatus);
        if (authStatus) {
            navigate(redirectPath);
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <AppStyled className="App">
            <Toaster richColors />
            <MainLayout>
                {isAuthenticated ? (
                    <>
                        <Navigation active={active} setActive={setActive} />
                        <main>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/income" element={<Income />} />
                                <Route path="/expenses" element={<Expenses />} />
                                <Route path="/transactions" element={<TransactionView />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </main>
                    </>
                ) : (
                    <Routes>
                        <Route 
                            path="/login" 
                            element={<Authentification onAuthenticate={handleAuthentication} />} 
                        />
                        <Route 
                            path="/forgot-password" 
                            element={<ForgotPassword />} 
                        />
                        <Route 
                            path="*" 
                            element={<Navigate to="/login" />} 
                        />
                    </Routes>
                )}
            </MainLayout>
        </AppStyled>
    );
}

const AppStyled = styled.div`
    height: 100vh;

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
            flex-wrap: wrap;

            li {
                flex: 1;
                cursor: pointer;

                @media (max-width: 768px) {
                    flex: 0 0 100%;
                    text-align: center;
                }

                padding: 0.5rem 1rem;
                color: #222260;
                font-weight: 500;
                transition: color 0.3s;

                &:hover {
                    color: #007bff;
                }
            }
        }
    }
`;

export default App;
