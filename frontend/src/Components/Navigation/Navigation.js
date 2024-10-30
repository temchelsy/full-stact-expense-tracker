import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { signout } from '../../utils/Icons';
import { menuItems } from '../../utils/menuItems';
import { useGlobalContext } from '../../context/globalContext';
import { Link } from 'react-router-dom';

function Navigation({ active, setActive }) {
    const { handleLogout } = useGlobalContext();
    const [lastName, setLastName] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('https://full-stact-expense-tracker.onrender.com/api/v1/current', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data.status === "success") {
                    setLastName(data.user.lastName);
                } else {
                    console.error("Failed to fetch user data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching current user data:", error);
            }
        };

        fetchCurrentUser();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <NavStyled isMenuOpen={isMenuOpen}>
            <div className="user-con">
                <div className="text">
                    <h2>{lastName ? lastName : 'User'}</h2>
                    <p>Your Money</p>
                </div>
                <button className="hamburger" onClick={toggleMenu}>
                    &#9776;
                </button>
            </div>
            {isMenuOpen && ( // Only show menu items if isMenuOpen is true
                <ul className={`menu-items ${isMenuOpen ? 'open' : ''}`}>
                    {menuItems.map((item) => (
                        <li
                            key={item.id}
                            className={active === item.id ? 'active' : ''}
                        >
                            <Link
                                to={item.link}
                                onClick={() => {
                                    setActive(item.id);
                                    setIsMenuOpen(false); // Close menu after clicking a link
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <div className="bottom-nav">
                <li onClick={handleLogout}>
                    {signout} Sign Out
                </li>
            </div>
        </NavStyled>
    );
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100%;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;

    .user-con {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100px;

        .hamburger {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            display: none;
        }

        h2 {
            color: rgba(34, 34, 96, 1);
        }
        p {
            color: rgba(34, 34, 96, 0.6);
        }
    }

    .menu-items {
        display: flex;
        flex-direction: column;
        transition: max-height 0.3s ease;
        
        &.open {
            max-height: 500px;
        }

        li {
            margin: 0.6rem 0;
            font-weight: 500;
            transition: all 0.4s ease-in-out;
            color: rgba(34, 34, 96, 0.6);
            position: relative;

            &.active {
                color: rgba(34, 34, 96, 1);
                &::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 4px;
                    height: 100%;
                    background: #222260;
                    border-radius: 0 10px 10px 0;
                }
            }

            span {
                margin-left: 1rem;
            }
        }
    }

    .bottom-nav {
        li {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: rgba(34, 34, 96, 0.6);
            transition: color 0.3s ease;
            
            &:hover {
                color: rgba(34, 34, 96, 1);
            }
        }
    }

    @media (max-width: 768px) {
        width: 100%;
        padding: 1.5rem 1rem;
        .user-con {
            .hamburger {
                display: block;
            }
        }

        .menu-items {
            max-height: ${props => (props.isMenuOpen ? '300px' : '0')}; /* Collapsible height */
            overflow: hidden;
            transition: max-height 0.4s ease;
        }
    }

    @media (max-width: 480px) {
        padding: 1rem;
        .menu-items {
            li {
                font-size: 0.8rem;
            }
        }
    }
`;

export default Navigation;
