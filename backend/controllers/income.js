import Income from '../models/IncomeModel.js'; // Ensure this model is correct

// Function to add income
export const addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    // Validations
    if (!title || !amount || !category || !description || !date) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    const income = new Income({
        title,
        amount: parsedAmount,
        category,
        description,
        date,
        userId: req.user.id, // Link this income to a user
    });

    try {
        await income.save();
        res.status(200).json({ message: 'Income Added', income });
    } catch (error) {
        console.error("Error saving income:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Function to get all incomes
export const getIncomes = async (req, res) => {
    const userId = req.user.id;

    try {
        const incomes = await Income.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error("Error fetching incomes:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Function to delete income
export const deleteIncome = async (req, res) => {
    const { id } = req.params;

    try {
        const income = await Income.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!income) {
            return res.status(404).json({ message: 'Income not found or not authorized to delete!' });
        }
        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        console.error("Error deleting income:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};
