import React, { useState } from 'react';
import styled from 'styled-components';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useGlobalContext } from '../context/globalContext';

const TransactionView = () => {
    const [visibleTransactions, setVisibleTransactions] = useState(10);
    const { incomes, expenses } = useGlobalContext();

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return '';
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        
        return dateObj.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    };

    const transactions = [
        ...incomes.map(income => ({ ...income, transactionType: 'Income' })),
        ...expenses.map(expense => ({ ...expense, transactionType: 'Expense' }))
    ].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

    const showAllTransactions = () => {
        setVisibleTransactions(transactions.length);
    };

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
        <Container>
            <Header>
                <Title>All Transactions</Title>
                {transactions.length > 0 && (
                    <IconButton onClick={downloadPDF} title="Download PDF">
                        <Download size={20} />
                    </IconButton>
                )}
            </Header>
            <TableContainer>
                <StyledTable>
                    <thead>
                        <tr>
                            <TableHeader>Date</TableHeader>
                            <TableHeader>Description</TableHeader>
                            <TableHeader>Amount (FCFA)</TableHeader>
                            <TableHeader>Type</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.slice(0, visibleTransactions).map(transaction => (
                            <TableRow key={transaction._id}>
                                <TableCell>{formatDate(transaction.date || transaction.createdAt)}</TableCell>
                                <TableCell>{transaction.description || transaction.title}</TableCell>
                                <TableCell className="amount">{formatAmount(transaction.amount)}</TableCell>
                                <TableCell>
                                    <TransactionType type={transaction.transactionType}>
                                        {transaction.transactionType}
                                    </TransactionType>
                                </TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </StyledTable>
                {visibleTransactions < transactions.length && (
                    <SeeMoreButton onClick={showAllTransactions}>
                        See More
                    </SeeMoreButton>
                )}
            </TableContainer>
        </Container>
    );
};


const Container = styled.div`
    padding: 2rem;
    max-width: 100%;
    
    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

const Title = styled.h2`
    font-size: 1.8rem;
    font-weight: 600;
    color: #2563eb;

    @media (max-width: 480px) {
        font-size: 1.5rem;
    }
`;

const IconButton = styled.button`
    background: transparent;
    border: none;
    color: #2563eb; 
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center; 
    padding: 0; 
    width: auto; 

    &:hover {
        background: transparent; 
    }

    &:focus {
        outline: none; 
    }
`;

const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        border-radius: 5px;
    }
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;

    @media (max-width: 768px) {
        min-width: 100%;
    }
`;

const TableHeader = styled.th`
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #4a5568;
    border-bottom: 2px solid #e2e8f0;

    @media (max-width: 768px) {
        padding: 0.75rem;
        font-size: 0.9rem;
    }
`;

const TableRow = styled.tr`
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f7fafc;
    }
`;

const TableCell = styled.td`
    padding: 1rem;
    color: #4a5568;

    &.amount {
        font-family: 'Courier New', monospace;
        text-align: right;
    }

    @media (max-width: 768px) {
        padding: 0.75rem;
        font-size: 0.9rem;
    }
`;

const TransactionType = styled.span`
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    color: ${({ type }) => (type === 'Income' ? '#155724' : '#721c24')};
    background-color: ${({ type }) => (type === 'Income' ? '#d4edda' : '#f8d7da')};
`;

const SeeMoreButton = styled.button`
    margin: 1rem auto;
    display: block;
    padding: 0.6rem 1.2rem;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s ease;

    &:hover {
        background: #1e3a8a;
    }

    @media (max-width: 480px) {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
`;

export default TransactionView;
