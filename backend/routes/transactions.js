import { addExpense, getExpenses, deleteExpense } from '../controllers/expense.js';
import { addIncome, getIncomes, deleteIncome } from '../controllers/income.js';
import { Router } from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js'; 

const router = Router();


router
    .post('/add-income', authenticateUser, addIncome)
    .get('/get-incomes', authenticateUser, getIncomes)
    .delete('/delete-income/:id', authenticateUser, deleteIncome)
    .post('/add-expense', authenticateUser, addExpense)
    .get('/get-expenses', authenticateUser, getExpenses)
    .delete('/delete-expense/:id', authenticateUser, deleteExpense);

export default router;
