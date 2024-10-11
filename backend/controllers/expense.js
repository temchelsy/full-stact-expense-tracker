import ExpenseSchema from '../models/ExpenseModel.js'; // Ensure this model is correct

// Function to add expense
export const addExpense = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    // Validations
    if (!title || !amount || !category || !description || !date) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    // Link this expense to the authenticated user by setting the userId
    const expense = new ExpenseSchema({
        title,
        amount: parsedAmount,
        category,
        description,
        date,
        userId: req.user.id, // Link this expense to the logged-in user
    });

    try {
        await expense.save();
        res.status(200).json({ message: 'Expense Added', expense });
    } catch (error) {
        console.error("Error saving expense:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Function to get all expenses
export const getExpenses = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await ExpenseSchema.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Function to delete an expense
export const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        // Ensure that only the user who created the expense can delete it
        const expense = await ExpenseSchema.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or not authorized to delete!' });
        }
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};
