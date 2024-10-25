// utils/menuItems.js
import { dashboard, expenses, transactions, trend } from '../utils/Icons';

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard', // Ensure this path is correct
    },
    {
        id: 2,
        title: "View Transactions",
        icon: transactions,
        link: "/transactions",
    },
    {
        id: 3,
        title: "Incomes",
        icon: trend,
        link: "/income",
    },
    {
        id: 4,
        title: "Expenses",
        icon: expenses,
        link: "/expenses", // Update this path to match your routing
    },
];
