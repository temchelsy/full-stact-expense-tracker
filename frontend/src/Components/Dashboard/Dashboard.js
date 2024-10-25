import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import Chart from '../Chart/Chart';

function Dashboard() {
    const { totalExpenses, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext();

    useEffect(() => {
        getIncomes();
        getExpenses();
    }, []);

    const formatNumber = (number) => {
        return new Intl.NumberFormat('fr-CM', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

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
                                <p>{formatNumber(totalIncome())}</p>
                            </div>
                            <div className="expense">
                                <h2>Total Expense</h2>
                                <p>{formatNumber(totalExpenses())}</p>
                            </div>
                            <div className="balance">
                                <h2>Total Balance</h2>
                                <p>{formatNumber(totalBalance())}</p>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        <History />
                        <h2 className="salary-title">Min <span>Income</span> Max</h2>
                        <div className="salary-item">
                            <p>{formatNumber(Math.min(...incomes.map(item => item.amount)))}</p>
                            <p>{formatNumber(Math.max(...incomes.map(item => item.amount)))}</p>
                        </div>
                        <h2 className="salary-title">Min <span>Expense</span> Max</h2>
                        <div className="salary-item">
                            <p>{formatNumber(Math.min(...expenses.map(item => item.amount)))}</p>
                            <p>{formatNumber(Math.max(...expenses.map(item => item.amount)))}</p>
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
            grid-template-columns: 1fr; /* Stack all items on small screens */
        }

        .chart-con {
            grid-column: 1 / 4; /* Chart takes the first 3 columns */
            height: auto; /* Allow for natural height */

            @media (max-width: 1200px) {
                grid-column: 1 / -1; /* Full width on smaller screens */
            }

            .amount-con {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 2rem;
                margin-top: 2rem;

                @media (max-width: 1200px) {
                    grid-template-columns: 1fr; /* Stack on small screens */
                    gap: 1.5rem;
                }

                .income, .expense, .balance {
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 20px;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;

                    h2 {
                        font-size: 1.5rem;
                        margin-bottom: 0.5rem;
                    }

                    p {
                        font-size: 1.8rem;
                        font-weight: 700;
                        word-break: break-word;
                    }
                }

                .balance p {
                    color: var(--color-green);
                    opacity: 0.6;
                }
            }
        }

        .history-con {
            grid-column: 4 / -1; /* History takes the last column */
            height: auto; /* Allow for natural height */
            margin-top: 20px; /* Add space to avoid overlap */

            @media (max-width: 1200px) {
                grid-column: 1 / -1; /* Full width on smaller screens */
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
                    font-size: 1.4rem;
                }
            }
        }
    }
`;

export default Dashboard;
