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
                    <div className="amount-con">
                        <div className="stat-item income">
                            <h2>Total Income</h2>
                            <p>{formatNumber(totalIncome())}</p>
                        </div>
                        <div className="stat-item expense">
                            <h2>Total Expense</h2>
                            <p>{formatNumber(totalExpenses())}</p>
                        </div>
                        <div className="stat-item balance">
                            <h2>Total Balance</h2>
                            <p>{formatNumber(totalBalance())}</p>
                        </div>
                    </div>
                    <div className="chart-con">
                        <Chart />
                    </div>
                    <div className="history-con">
                        <History />
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    font-family: 'Nunito', sans-serif;

    .stats-con {
        display: flex;
        flex-direction: column;
        gap: 2rem;

        .amount-con {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            flex-wrap: wrap;

            .stat-item {
                background: #f7f9fc; /* Light gray background for stat items */
                border: 2px solid #e3e6ee; /* Soft border color */
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.1);
                border-radius: 20px;
                padding: 1.5rem;
                flex: 1;
                min-width: 240px;
                text-align: center;
                transition: transform 0.2s ease, box-shadow 0.2s ease;

                &:hover {
                    transform: translateY(-5px);
                    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.15);
                }

                h2 {
                    font-size: 1.3rem;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #333; /* Darker text color */
                }

                p {
                    font-size: 1.6rem;
                    font-weight: 700;
                }
            }

            .income {
                color: #28a745; /* Green for income */
            }

            .expense {
                color: #dc3545; /* Red for expense */
            }

            .balance {
                color: #17a2b8; /* Teal for balance */
            }
        }

        .chart-con {
            background: #ffffff; /* White background for the chart */
            border-radius: 15px;
            padding: 1.5rem;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }

        .history-con {
            background: #ffffff; /* White background for history */
            border-radius: 15px;
            padding: 1.5rem;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.08);
            margin-top: 1.5rem;

            h2 {
                font-size: 1.2rem;
                font-weight: 600;
                color: #333; /* Darker text color for history title */
                margin-bottom: 1rem;
            }
        }
    }

    /* Responsive Styling */
    @media (max-width: 992px) {
        .amount-con {
            flex-direction: column;
            align-items: center;
            .stat-item {
                min-width: 80%;
                margin-bottom: 1rem;
            }
        }
    }

    @media (max-width: 768px) {
        .stats-con {
            gap: 1.5rem;
        }
        .chart-con, .history-con {
            padding: 1rem;
        }
        .amount-con .stat-item p {
            font-size: 1.4rem;
        }
    }

    @media (max-width: 480px) {
        h1 {
            font-size: 1.5rem;
            text-align: center;
        }
        .amount-con .stat-item {
            padding: 1rem;
        }
    }
`;

export default Dashboard;
