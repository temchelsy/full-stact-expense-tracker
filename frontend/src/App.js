import React, { useState, useMemo } from 'react';
import styled from "styled-components";
import bg from './img/bg.png';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import { useGlobalContext } from './context/globalContext';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from './Components/Auth/login';
import Registration from './Components/Auth/registration';

function App() {
    const [active, setActive] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    const global = useGlobalContext();
    console.log(global);

    const orbMemo = useMemo(() => <Orb />, []);

    const handleAuthentication = (authStatus) => {
        setIsAuthenticated(authStatus);
    };

    return (
        <AppStyled bg={bg} className="App">
            {orbMemo}
            <MainLayout>
                {isAuthenticated ? (
                    <>
                        <Navigation active={active} setActive={setActive} />
                        <main>
                            <Routes>
                                <Route path="/" element={<Dashboard />} /> {/* Dashboard as home */}
                                <Route path="/income" element={<Income />} />
                                <Route path="/expenses" element={<Expenses />} />
                                <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to Dashboard if path not found */}
                            </Routes>
                        </main>
                    </>
                ) : (
                    <Routes>
                        <Route path="/login" element={<Login onAuthenticate={handleAuthentication} />} />
                        <Route path="/register" element={<Registration onAuthenticate={handleAuthentication} />} />
                        <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect to Login if path not found */}
                    </Routes>
                )}
            </MainLayout>
        </AppStyled>
    );
}

const AppStyled = styled.div`
    height: 100vh;
    background-image: url(${props => props.bg});
    position: relative;
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
`;

export default App;
