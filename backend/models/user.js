import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },  // New field for storing the reset token
    resetPasswordExpires: { type: Date },  // New field for storing when the token expires
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
