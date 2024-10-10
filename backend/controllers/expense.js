import ExpenseSchema from '../models/ExpenseModel.js';

export const addExpense = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    // Log the entire request body for debugging
    console.log("Request body:", req.body);

    // Validations
    if (!title || !category || !description || !date) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // Convert amount to a number
    const parsedAmount = parseFloat(amount);

    // Validate amount is a number and greater than 0
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    const expense = new ExpenseSchema({
        title,
        amount: parsedAmount, // Store the parsed amount
        category,
        description,
        date,
    });

    try {
        await expense.save();
        res.status(200).json({ message: 'Expense Added' });
    } catch (error) {
        console.error("Error saving expense:", error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error' });
    }

    console.log(expense);
};

export const getExpense = async (req, res) => {
    try {
        const expenses = await ExpenseSchema.find().sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await ExpenseSchema.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found!' });
        }
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        console.error("Error deleting expense:", error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error' });
    }
};
