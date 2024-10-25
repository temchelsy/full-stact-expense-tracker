import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { signout } from '../../utils/Icons';
import { menuItems } from '../../utils/menuItems';
import { useGlobalContext } from '../../context/globalContext';
import { Link } from 'react-router-dom'; 

function Navigation({ active, setActive }) {
    const { handleLogout } = useGlobalContext();
    const [lastName, setLastName] = useState(localStorage.getItem('lastName'));

    useEffect(() => {
        const storedLastName = localStorage.getItem('lastName');
        if (storedLastName) {
            setLastName(storedLastName);
        }
    }, []);

    return (
        <NavStyled>
            <div className="user-con">
                <div className="text">
                    <h2>{lastName ? lastName : 'User'}</h2>
                    <p>Your Money</p>
                </div>
            </div>
            <ul className="menu-items">
                {menuItems.map((item) => (
                    <li
                        key={item.id}
                        className={active === item.id ? 'active' : ''}
                    >
                        <Link 
                            to={item.link} 
                            onClick={() => setActive(item.id)} 
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
        }

        .menu-items {
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
