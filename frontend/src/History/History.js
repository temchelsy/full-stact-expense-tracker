import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/globalContext';

function History() {
    const { transactionHistory } = useGlobalContext();
    const [...history] = transactionHistory();

    return (
        <HistoryStyled>
            <h2>Recent History</h2>
            {history.map((item) => {
                const { _id, title, amount, type } = item;
                return (
                    <div key={_id} className="history-item">
                        <p
                            className="title"
                            style={{
                                color: type === 'expense' ? 'red' : 'var(--color-green)',
                            }}
                        >
                            {title}
                        </p>
                        <p
                            className="amount"
                            style={{
                                color: type === 'expense' ? 'red' : 'var(--color-green)',
                            }}
                        >
                            {type === 'expense' ? `-${amount <= 0 ? 0 : amount}` : `+${amount <= 0 ? 0 : amount}`}
                        </p>
                    </div>
                );
            })}
        </HistoryStyled>
    );
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
    max-width: 600px; 
    margin: auto; 

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: var(--primary-color);
    }

    .history-item {
        background: #fcf6f9;
        border: 2px solid #ffffff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease-in-out;

        .title, .amount {
            font-size: 1rem;
            font-weight: 600;
        }
    }

    @media (max-width: 768px) {
        h2 {
            font-size: 1.3rem; 
        }

        .history-item {
            flex-direction: column; 
            align-items: flex-start; 
            padding: 0.8rem; 
            gap: 0.5rem;

            .title, .amount {
                font-size: 0.9rem; 
            }
        }
    }

    @media (max-width: 480px) {
        h2 {
            font-size: 1.2rem;
        }

        .history-item {
            padding: 0.6rem; 
            gap: 0.4rem; 

            .title, .amount {
                font-size: 0.85rem; 
            }
        }
    }
`;

export default History;
