import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/globalContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { pdfDownload } from '../utils/Icons';

const TransactionView = () => {
    const { incomes, expenses } = useGlobalContext();

    // Format amount to FCFA
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format date function
    const formatDate = (date) => {
        if (!date) return '';
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return ''; // Return empty string if invalid date
        
        return dateObj.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    };

    // Add type property to each transaction before combining
    const formattedIncomes = incomes.map(income => ({
        ...income,
        transactionType: 'Income'
    }));
    
    const formattedExpenses = expenses.map(expense => ({
        ...expense,
        transactionType: 'Expense'
    }));

    // Combine and sort transactions
    const transactions = [...formattedIncomes, ...formattedExpenses]
        .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('All Transactions', 14, 16);

        const tableData = transactions.map(transaction => [
            formatDate(transaction.date || transaction.createdAt),
            transaction.description || transaction.title,
            formatAmount(transaction.amount),
            transaction.transactionType
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
            <div className="header">
                <h2>All Transactions</h2>
                <Button onClick={downloadPDF}>
                    {pdfDownload} Download PDF
                </Button>
            </div>
            <TableContainer>
                <StyledTable>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount (FCFA)</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction._id}>
                                <td>{formatDate(transaction.date || transaction.createdAt)}</td>
                                <td>{transaction.description || transaction.title}</td>
                                <td className="amount">{formatAmount(transaction.amount)}</td>
                                <td>
                                    <TransactionType type={transaction.transactionType}>
                                        {transaction.transactionType}
                                    </TransactionType>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </StyledTable>
            </TableContainer>
        </TransactionViewStyled>
    );
};

const TransactionViewStyled = styled.div`
    padding: 2rem;
    
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;

        h2 {
            font-size: 1.8rem;
            font-weight: 600;
            color: var(--primary-color);
        }
    }
`;

const Button = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.2rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    background: white;
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    
    thead {
        background-color: #f8f9fa;
        
        th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: #495057;
            border-bottom: 2px solid #dee2e6;
        }
    }

    tbody {
        tr {
            border-bottom: 1px solid #dee2e6;
            transition: background-color 0.2s ease;

            &:hover {
                background-color: #f8f9fa;
            }
        }

        td {
            padding: 1rem;
            color: #495057;

            &.amount {
                font-family: 'Courier New', monospace;
                text-align: right;
            }
        }
    }
`;

const TransactionType = styled.span`
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    
    ${props => props.type === 'Income' ? `
        background-color: #d4edda;
        color: #155724;
    ` : `
        background-color: #f8d7da;
        color: #721c24;
    `}
`;

export default TransactionView;