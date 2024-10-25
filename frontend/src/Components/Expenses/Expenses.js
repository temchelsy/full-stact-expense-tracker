import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Form from '../Form/Form';
import IncomeItem from '../IncomeItem/IncomeItem';
import ExpenseForm from './ExpenseForm';

function Expenses() {
    const { addIncome, expenses, getExpenses, deleteExpense, totalExpenses } = useGlobalContext();

    useEffect(() => {
        getExpenses();
    }, []);

    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className="total-income">Total Expense: <span>${totalExpenses()}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <ExpenseForm />
                    </div>
                    <div className="incomes">
                        {expenses.map((income) => {
                            const { _id, title, amount, date, category, description, type } = income;
                            return (
                                <IncomeItem
                                    key={_id}
                                    id={_id}
                                    title={title}
                                    description={description}
                                    amount={amount}
                                    date={date}
                                    type={type}
                                    category={category}
                                    indicatorColor="var(--color-green)"
                                    deleteItem={deleteExpense}
                                />
                            );
                        })}
                    </div>
                </div>
            </InnerLayout>
        </ExpenseStyled>
    );
}

const ExpenseStyled = styled.div`
    display: flex;
    flex-direction: column; /* Stacked layout for smaller screens */
    overflow: hidden; /* Prevent overflow issues */
    
    .total-income {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;

        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }

    .income-content {
        display: flex;
        flex-direction: column; /* Stacked layout on smaller screens */
        gap: 2rem;

        @media (min-width: 768px) {
            flex-direction: row; /* Switch to row layout on larger screens */
        }

        .form-container {
            flex: 1; /* Make form take full width */
            max-width: 400px; /* Limit max width */
            margin: auto; /* Center the form container */
        }

        .incomes {
            flex: 1; /* Make incomes take the remaining space */
            display: flex;
            flex-direction: column; /* Stack items vertically */
            gap: 1rem; /* Gap between income items */

            @media (min-width: 768px) {
                flex-direction: row; /* Align income items side by side */
                flex-wrap: wrap; /* Wrap items if necessary */
                gap: 1.5rem; /* Increase gap for better spacing */
            }
        }
    }
`;

export default Expenses;
