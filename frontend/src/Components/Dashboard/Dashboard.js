import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { franc } from '../../utils/Icons';
import Chart from '../Chart/Chart';

function Dashboard() {
    const { totalExpenses, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext();

    useEffect(() => {
        getIncomes();
        getExpenses();
    }, []);

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="stats-con">
                    <div className="chart-con">
                        <Chart />
                        <div className="amount-con">
                            <div className="income">
                                <h2>Total Income</h2>
                                <p>
                                    {franc} {totalIncome()} {/* replaced dollar with franc */}
                                </p>
                            </div>
                            <div className="expense">
                                <h2>Total Expense</h2>
                                <p>
                                    {franc} {totalExpenses()} {/* replaced dollar with franc */}
                                </p>
                            </div>
                            <div className="balance">
                                <h2>Total Balance</h2>
                                <p>
                                    {franc} {totalBalance()} {/* replaced dollar with franc */}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        <History />
                        <h2 className="salary-title">Min <span>Income</span> Max</h2>
                        <div className="salary-item">
                            <p>
                                ₣{Math.min(...incomes.map(item => item.amount))} {/* updated symbol */}
                            </p>
                            <p>
                                ₣{Math.max(...incomes.map(item => item.amount))} {/* updated symbol */}
                            </p>
                        </div>
                        <h2 className="salary-title">Min <span>Expense</span> Max</h2>
                        <div className="salary-item">
                            <p>
                                ₣{Math.min(...expenses.map(item => item.amount))} {/* updated symbol */}
                            </p>
                            <p>
                                ₣{Math.max(...expenses.map(item => item.amount))} {/* updated symbol */}
                            </p>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    .stats-con {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2rem;

        @media (max-width: 1200px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }

        .chart-con {
            grid-column: 1 / 4;
            height: 400px;

            @media (max-width: 1200px) {
                grid-column: 1 / -1;
            }

            .amount-con {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
                margin-top: 2rem;

                @media (max-width: 1200px) {
                    grid-template-columns: repeat(2, 1fr);
                }

                @media (max-width: 576px) {
                    grid-template-columns: 1fr;
                }

                .income, .expense {
                    grid-column: span 2;

                    @media (max-width: 576px) {
                        grid-column: 1;
                    }
                }

                .income, .expense, .balance {
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 20px;
                    padding: 1rem;

                    p {
                        font-size: 2.5rem; /* Reduced font size for numbers */
                        font-weight: 700;

                        i {
                            font-size: 1.5rem; /* Reduced size of icon */
                            margin-right: 0.5rem; /* Space between icon and number */
                        }

                        @media (max-width: 768px) {
                            font-size: 2rem; /* Further reduce font size for smaller screens */
                        }
                    }
                }

                .balance {
                    grid-column: 2 / 4;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    @media (max-width: 1200px) {
                        grid-column: 1 / -1;
                    }

                    p {
                        color: var(--color-green);
                        opacity: 0.6;
                        font-size: 3.5rem; /* Reduced size for balance number */
                        i {
                            font-size: 2rem; /* Reduced icon size for balance */
                        }

                        @media (max-width: 768px) {
                            font-size: 2.5rem; /* Further reduce font size for smaller screens */
                        }
                    }
                }
            }
        }

        .history-con {
            grid-column: 4 / -1;

            @media (max-width: 1200px) {
                grid-column: 1 / -1;
            }

            h2 {
                margin: 1rem 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .salary-title {
                font-size: 1.2rem;
                span {
                    font-size: 1.8rem;
                }
            }

            .salary-item {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                padding: 1rem;
                border-radius: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                p {
                    font-weight: 600;
                    font-size: 1.6rem;

                    @media (max-width: 768px) {
                        font-size: 1.4rem;
                    }
                }
            }
        }
    }
`;

export default Dashboard;
