import mongoose from 'mongoose';

export const db = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('Db Connected');
    } catch (error) {
        console.log('DB Connection Error:', error);
    }
};
