import mongoose from 'mongoose';

const PendingUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  gender: { type: String },
  dob: { type: Date },
  phone: { type: String, index: true },
  email: { type: String, index: true },
  username: { type: String, index: true },
  password: { type: String, required: true }, // hashed
  roles: { type: [String], default: ['tenant'] },
  otp: { type: String },
  otpExpiresAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('PendingUser', PendingUserSchema);
