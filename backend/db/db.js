import mongoose from "mongoose";
import { MONGO_URL } from "../constants/constants.js";

export const db = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGO_URL);
    console.log("Db Connected");
  } catch (error) {
    console.log("DB Connection Error:", error);
  }
};
