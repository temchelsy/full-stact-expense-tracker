import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Password is optional for OAuth users
    googleId: { type: String, unique: true, sparse: true }, // Unique but optional for non-Google users
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Add a sparse index to optimize searches on `googleId`
userSchema.index({ googleId: 1 });

// Helper method to check if the user has a password set
userSchema.methods.hasPassword = function () {
  return !!this.password;
};

const User = mongoose.model('User', userSchema);
export default User;
