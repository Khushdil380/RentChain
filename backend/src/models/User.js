import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dob: { type: Date },
  phone: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  roles: { type: [String], default: ['tenant'] },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiresAt: { type: Date },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

export default mongoose.model('User', UserSchema);
