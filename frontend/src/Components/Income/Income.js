import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Form from '../Form/Form';
import IncomeItem from '../IncomeItem/IncomeItem';

function Income() {
    const { addIncome, incomes, getIncomes, deleteIncome, totalIncome } = useGlobalContext();

    useEffect(() => {
        getIncomes();
    }, []);

   
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-CM', {
            style: 'currency',
            currency: 'XAF', 
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <IncomeStyled>
            <InnerLayout>
                <h1>Incomes</h1>
                <h2 className="total-income">
                    Total Income: <span>{formatCurrency(totalIncome())}</span>
                </h2>
                <div className="income-content">
                    <div className="form-container">
                        <Form />
                    </div>
                    <div className="incomes">
                        {incomes.map((income) => {
                            const { _id, title, amount, date, category, description, type } = income;
                            return (
                                <IncomeItem
                                    key={_id}
                                    id={_id}
                                    title={title}
                                    description={description}
                                    amount={formatCurrency(amount)} 
                                    date={date}
                                    type={type}
                                    category={category}
                                    indicatorColor="var(--color-green)"
                                    deleteItem={deleteIncome}
                                />
                            );
                        })}
                    </div>
                </div>
            </InnerLayout>
        </IncomeStyled>
    );
}

const IncomeStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 2rem 0;

    h1 {
        font-size: 2.5rem;
        text-align: center;
        margin-bottom: 1rem;
    }

    .total-income {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fcf6f9;
        border: 2px solid #fff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1.5rem;
        margin: 1.5rem 0;
        font-size: 1.8rem;
        text-align: center;

        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }

    .income-content {
        display: flex;
        flex-direction: row;
        gap: 2rem;

        .form-container {
            flex: 1;
            max-width: 500px;
        }

        .incomes {
            flex: 2;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
    }

    @media (max-width: 768px) {
        .income-content {
            flex-direction: column;

            .form-container, .incomes {
                width: 100%;
            }
        }

        .total-income {
            font-size: 1.5rem;

            span {
                font-size: 2rem;
            }
        }

        h1 {
            font-size: 2rem;
        }
    }
`;

export default Income;