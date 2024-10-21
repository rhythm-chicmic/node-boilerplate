'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');

const { Schema } = MONGOOSE;

/** *********** User Model ********** */
const userSchema = new Schema({
  userName: { type: String },
  email: { type: String },
  password: { type: String },
  walletAddress: { type: String, lowercase: true, default: '' },
  referralCode: { type: String },
  lastLoginDate: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false, collection: 'users' });

module.exports = MONGOOSE.model('users', userSchema);
