import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';

const BASE_URL = "https://full-stact-expense-tracker.onrender.com/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize axios with token
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
        setIsInitialized(true);
    }, []);

    // Fetch initial data after initialization
    useEffect(() => {
        if (isInitialized && token) {
            getIncomes();
            getExpenses();
        }
    }, [isInitialized, token]);

    // Add axios interceptor to handle 401 errors
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    // Clear token and redirect to login
                    localStorage.removeItem('token');
                    setToken(null);
                    setError('Session expired. Please login again.');
                    // You might want to redirect to login page here
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${BASE_URL}add-income`, income);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add income');
            throw err;
        }
    };

    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get incomes');
            throw err;
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete income');
            throw err;
        }
    };

    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expense');
            throw err;
        }
    };

    const getExpenses = async () => {
        if (!token) {
            setError('Authentication token is missing');
            return;
        }
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get expenses');
            throw err;
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete expense');
            throw err;
        }
    };

    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 4);
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
            userId,
            setUserId,
            token,
            setToken
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};