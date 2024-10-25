import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/globalContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { pdfDownload } from '../utils/Icons'; 

const TransactionView = () => {
    const { incomes, expenses } = useGlobalContext();

    // Combine incomes and expenses
    const transactions = [...incomes, ...expenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('All Transactions', 14, 16);

        const tableData = transactions.map(transaction => [
            new Date(transaction.createdAt).toLocaleDateString(),
            transaction.description || transaction.title,
            transaction.amount,
            transaction.amount > 0 ? 'Income' : 'Expense'
        ]);

        doc.autoTable({
            head: [['Date', 'Description', 'Amount', 'Type']],
            body: tableData,
            startY: 20,
        });

        doc.save('transactions.pdf');
    };

    return (
        <TransactionViewStyled>
            <h2>All Transactions</h2>
            <IconWrapper onClick={downloadPDF}>
                {pdfDownload}
                <span>Download</span>
            </IconWrapper>
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction._id}>
                                <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                                <td>{transaction.description || transaction.title}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.amount > 0 ? 'Income' : 'Expense'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TransactionViewStyled>
    );
};

const TransactionViewStyled = styled.div`
    margin: 2rem 0;
    
    h2 {
        margin-bottom: 1rem;
        font-size: 1.8rem;
    }

    .table-responsive {
        overflow-x: auto; 
        margin-bottom: 2rem;

        table {
            width: 100%;
            border-collapse: collapse;

            th, td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #ddd;

                @media (max-width: 768px) {
                    padding: 10px;
                    font-size: 0.9rem; 
                }
            }

            th {
                background-color: #f4f4f4;
            }

            tr:hover {
                background-color: #f1f1f1;
            }
        }
    }

    @media (max-width: 768px) {
        h2 {
            font-size: 1.5rem; 
        }
    }
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 1rem;

    span {
        margin-left: 8px; /* Add space between icon and text */
        font-size: 1.2rem;
        color: #007bff; /* Change this color as needed */
    }

    
`;

export default TransactionView;
