import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    amount: {
        type: Number,
        required: true,
        maxLength: 50,
        trim: true
    },
    type: {
        type: String,
        default: "income"
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 100,
        trim: true
    },
    userId: { // Field to link the income to a user
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to User model
    }
}, { timestamps: true });

export default mongoose.model('Income', IncomeSchema);
