import ExpenseSchema from '../models/ExpenseModel.js';

// Add expense
export const addExpense = async (req, res) => {
    const { title, amount, category, description, date, userId } = req.body; // Add userId here

    console.log("Request body:", req.body);

    // Validations
    if (!title || !category || !description || !date) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    const expense = new ExpenseSchema({
        title,
        amount: parsedAmount,
        category,
        description,
        date,
        userId // Store the userId in the expense
    });

    try {
        await expense.save();
        res.status(200).json({ message: 'Expense Added' });
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ message: 'Server Error' });
    }

    console.log(expense);
};

// Get all expenses
export const getExpenses = async (req, res) => {
    const userId = req.user.id; // Ensure this is properly set

    try {
        const expenses = await ExpenseSchema.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await ExpenseSchema.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found!' });
        }
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Check if you really need getExpense here; if not needed, just remove it.
