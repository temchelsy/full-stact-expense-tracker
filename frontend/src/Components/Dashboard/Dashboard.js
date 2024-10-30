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
                    {/* Summary Stats */}
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

                    {/* Chart Component */}
                    <div className="chart-con">
                        <Chart />
                    </div>

                    {/* History Section for Recent Transactions */}
                    <div className="history-con">
                        <History />
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    font-family: 'Sans-Serif', 'Nunito', sans-serif; /* Apply sans-serif font */

    .stats-con {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;

        @media (max-width: 1200px) {
            grid-template-columns: 1fr; /* Stack all items on small screens */
        }

        .amount-con {
            grid-column: 1 / -1; /* Full width for amount section */
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;

            @media (max-width: 1200px) {
                flex-direction: column; /* Stack on small screens */
            }

            .income, .expense, .balance {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                border-radius: 20px;
                padding: 1rem;
                flex: 1; /* Allow items to take equal width */
                margin-right: 1rem; /* Space between items */
                min-width: 200px; /* Ensure minimum width for readability */

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

            .income, .expense {
                margin-right: 1rem; /* Space only between income and expense */
            }

            .balance {
                color: var(--color-green);
                opacity: 0.6;
            }
        }

        .chart-con {
            grid-column: 1 / -1; /* Full width for chart */
            height: auto; /* Allow for natural height */
        }

        .history-con {
            grid-column: 1 / -1; /* Full width for history */
            margin-top: 20px; /* Add space to avoid overlap */

            h2 {
                margin: 1rem 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
    }
`;

export default Dashboard;
                                       