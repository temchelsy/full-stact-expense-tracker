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
        setIsMenuOpen(prevState => !prevState);
    };

    return (
        <NavStyled isMenuOpen={isMenuOpen}>
            <div className="user-con">
                <div className="text">
                    <h2>{lastName ? lastName : 'User'}</h2>
                    <p>Your Money</p>
                </div>
                <button className="hamburger" onClick={toggleMenu}>
                    &#9776; {/* Hamburger icon */}
                </button>
            </div>
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
                                setIsMenuOpen(false); // Close menu on item click
                            }}
                            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
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
    width: 374px; /* Fixed width for larger screens */
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
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;

        .hamburger {
            display: none; /* Hide hamburger button by default */
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
        }

        h2 {
            color: rgba(34, 34, 96, 1);
        }

        p {
            color: rgba(34, 34, 96, 0.6);
        }
    }

    .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;
        transition: max-height 0.3s ease;

        &.open {
            max-height: 500px; /* Adjust based on menu items */
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

    /* Responsive Styles */
    @media (max-width: 768px) {
        width: 100%; /* Full width on smaller screens */
        padding: 1.5rem 1rem; /* Adjust padding for smaller screens */

        .user-con {
            height: 80px; /* Adjust user container height */
            justify-content: space-between; /* Space between user text and hamburger */

            .hamburger {
                display: block; /* Show hamburger button on mobile */
                color: #0679FC; /* Blue color for the icon on mobile view */
            }
        }

        .menu-items {
            display: ${props => (props.isMenuOpen ? 'flex' : 'none')}; /* Show or hide menu items based on isMenuOpen */
            flex-direction: column;

            li {
                margin: 0.4rem 0; /* Reduce margin between items */
                font-size: 0.9rem; /* Adjust font size for smaller screens */
            }
        }

        .bottom-nav {
            li {
                font-size: 0.9rem; /* Adjust font size for sign-out */
            }
        }
    }

    @media (max-width: 480px) {
        padding: 1rem; /* Further reduce padding for very small screens */

        .user-con {
            height: 60px; /* Further adjust user container height */
        }

        .menu-items {
            li {
                font-size: 0.8rem; /* Further adjust font size */
            }
        }
    }
`;

export default Navigation;
