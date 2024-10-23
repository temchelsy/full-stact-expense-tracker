import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';

const BASE_URL = "https://full-stact-expense-tracker.onrender.com/api/v1/";

const GlobalContext = React.createContext();

// Secure token storage utility
const TokenService = {
    getToken: () => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        console.log("Token fetched from storage:", token); // Debugging
        return token;
    },
    setToken: (token) => {
        if (token) {
            sessionStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log("Token set in Axios headers:", axios.defaults.headers.common['Authorization']); // Debugging
        } else {
            sessionStorage.removeItem('token');
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    },
    removeToken: () => {
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    }
};

// Axios interceptor to automatically attach the token
axios.interceptors.request.use((config) => {
    const token = TokenService.getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);

    // Initialize authentication state
    useEffect(() => {
        const initializeAuth = async () => {
            const token = TokenService.getToken();
            console.log("Initial token:", token ? "exists" : "not found"); // Debugging

            if (token) {
                TokenService.setToken(token); // This sets axios headers
                setIsAuthenticated(true);
                try {
                    await Promise.all([getIncomes(), getExpenses()]);
                    console.log("Initial data fetch successful");
                } catch (err) {
                    console.error("Error fetching initial data:", err.response ? err.response.data : err.message);
                    if (err.response?.status === 401) {
                        handleLogout();
                    }
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const handleLogin = async (token, uid) => {
        console.log("Handling login...");
        TokenService.setToken(token);
        setIsAuthenticated(true);
        setUserId(uid);
        try {
            await Promise.all([getIncomes(), getExpenses()]);
            console.log("Data fetched after login");
        } catch (err) {
            console.error("Error fetching data after login:", err.response ? err.response.data : err.message);
            setError("Failed to fetch data after login");
        }
    };

    const handleLogout = () => {
        console.log("Handling logout...");
        TokenService.removeToken();
        setIsAuthenticated(false);
        setUserId(null);
        setIncomes([]);
        setExpenses([]);
    };

    // API request wrapper with auth check
    const protectedRequest = async (request) => {
        const token = TokenService.getToken();
        if (!token) {
            console.log("No token found in protectedRequest");
            handleLogout();
            throw new Error('User not authenticated');
        }

        try {
            return await request();
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            }
            throw error;
        }
    };

    const addIncome = async (income) => {
        try {
            await protectedRequest(() => axios.post(`${BASE_URL}add-income`, income));
            await getIncomes();
        } catch (err) {
            setError(err.message || 'Failed to add income');
            throw err;
        }
    };

    const getIncomes = async () => {
        try {
            const response = await protectedRequest(() => axios.get(`${BASE_URL}get-incomes`));
            console.log("Incomes response data:", response.data); // Debugging
            setIncomes(response.data);
            return response.data;
        } catch (err) {
            console.error("Error fetching incomes:", err.response ? err.response.data : err.message);
            setError(err.message || 'Failed to fetch incomes');
            throw err;
        }
    };

    const deleteIncome = async (id) => {
        try {
            await protectedRequest(() => axios.delete(`${BASE_URL}delete-income/${id}`));
            await getIncomes();
        } catch (err) {
            setError(err.message || 'Failed to delete income');
            throw err;
        }
    };

    const addExpense = async (expense) => {
        try {
            await protectedRequest(() => axios.post(`${BASE_URL}add-expense`, expense));
            await getExpenses();
        } catch (err) {
            setError(err.message || 'Failed to add expense');
            throw err;
        }
    };

    const getExpenses = async () => {
        try {
            const response = await protectedRequest(() => axios.get(`${BASE_URL}get-expenses`));
            console.log("Expenses response data:", response.data); // Debugging
            setExpenses(response.data);
            return response.data;
        } catch (err) {
            console.error("Error fetching expenses:", err.response ? err.response.data : err.message);
            setError(err.message || 'Failed to fetch expenses');
            throw err;
        }
    };

    const deleteExpense = async (id) => {
        try {
            await protectedRequest(() => axios.delete(`${BASE_URL}delete-expense/${id}`));
            await getExpenses();
        } catch (err) {
            setError(err.message || 'Failed to delete expense');
            throw err;
        }
    };

    // Calculation methods
    const totalIncome = () => incomes.reduce((total, income) => total + income.amount, 0);
    const totalExpenses = () => expenses.reduce((total, expense) => total + expense.amount, 0);
    const totalBalance = () => totalIncome() - totalExpenses();
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
            isLoading,
            isAuthenticated,
            handleLogin,
            handleLogout,
            userId
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
