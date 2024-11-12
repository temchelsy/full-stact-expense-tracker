import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Make password optional for Google users
    googleId: { type: String, unique: true, sparse: true }, // Add Google ID, unique but can be absent for non-Google users
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Add an index for googleId to optimize querying
userSchema.index({ googleId: 1 });

const User = mongoose.model("User", userSchema);
export default User;
