const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Patient Profile Schema
const patientProfileSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  memberId: { type: String, required: true, unique: true },
  groupNumber: { type: String, required: true },
  insuranceProvider: { type: String, required: true },
  planType: { type: String, required: true },
  effectiveDate: { type: Date, required: true },
  copay: { type: String, required: true },
  deductible: { type: String, required: true },
  outOfPocketMax: { type: String, required: true }
});

// Provider Profile Schema
const providerProfileSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  specialty: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  npiNumber: { type: String, required: true, unique: true },
  clinic: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  fax: { type: String },
  yearsExperience: { type: Number, required: true },
  boardCertified: { type: Boolean, default: false }
});

// Payor Profile Schema
const payorProfileSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  company: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  extension: { type: String },
  address: { type: String, required: true },
  region: { type: String, required: true },
  authority: { type: String, required: true }
});

// Main User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['patient', 'provider', 'payor']
  },
  profile: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update updatedAt field
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get user without password
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find user by email and role
userSchema.statics.findByEmailAndRole = function(email, role) {
  return this.findOne({ email, role, isActive: true });
};

// Validate profile based on role
userSchema.pre('save', function(next) {
  if (this.role === 'patient') {
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'memberId'];
    for (let field of requiredFields) {
      if (!this.profile[field]) {
        return next(new Error(`${field} is required for patient profile`));
      }
    }
  } else if (this.role === 'provider') {
    const requiredFields = ['firstName', 'lastName', 'specialty', 'licenseNumber', 'npiNumber'];
    for (let field of requiredFields) {
      if (!this.profile[field]) {
        return next(new Error(`${field} is required for provider profile`));
      }
    }
  } else if (this.role === 'payor') {
    const requiredFields = ['firstName', 'lastName', 'title', 'employeeId'];
    for (let field of requiredFields) {
      if (!this.profile[field]) {
        return next(new Error(`${field} is required for payor profile`));
      }
    }
  }
  next();
});

// Create indexes for better performance
userSchema.index({ email: 1, role: 1 });
userSchema.index({ 'profile.memberId': 1 }, { sparse: true });
userSchema.index({ 'profile.licenseNumber': 1 }, { sparse: true });
userSchema.index({ 'profile.employeeId': 1 }, { sparse: true });

module.exports = mongoose.model('User', userSchema);