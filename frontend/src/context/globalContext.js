import React, { useContext, useState } from "react";
import axios from 'axios';

const BASE_URL = "https://full-stact-expense-tracker.onrender.com/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({children}) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // Store the user ID here

    // Set user ID after login
    const setCurrentUserId = (id) => {
        setUserId(id);
    };

    // Calculate total incomes
    const addIncome = async (income) => {
        const response = await axios.post(`${BASE_URL}add-income`, { ...income, userId }) // Include user ID
            .catch((err) => {
                setError(err.response.data.message);
            });
        getIncomes();
    };

    const getIncomes = async () => {
        if (!userId) return; // Ensure user ID is available
        const response = await axios.get(`${BASE_URL}get-incomes`, { params: { userId } }); // Include user ID
        setIncomes(response.data);
        console.log(response.data);
    };

    const deleteIncome = async (id) => {
        const res = await axios.delete(`${BASE_URL}delete-income/${id}`);
        getIncomes();
    };

    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    // Calculate total expenses
    const addExpense = async (expense) => {
        const response = await axios.post(`${BASE_URL}add-expense`, { ...expense, userId }) // Include user ID
            .catch((err) => {
                setError(err.response.data.message);
            });
        getExpenses();
    };

    const getExpenses = async () => {
        if (!userId) return; // Ensure user ID is available
        const response = await axios.get(`${BASE_URL}get-expenses`, { params: { userId } }); // Include user ID
        setExpenses(response.data);
        console.log(response.data);
    };

    const deleteExpense = async (id) => {
        const res = await axios.delete(`${BASE_URL}delete-expense/${id}`);
        getExpenses();
    };

    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError,
            setCurrentUserId, // Expose function to set user ID
            userId, // Provide user ID
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
