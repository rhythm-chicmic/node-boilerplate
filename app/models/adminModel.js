'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');

const { Schema } = MONGOOSE;

/** *********** User Model ********** */
const adminSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  walletAddress: { type: String, lowercase: true, default: '' },
  lastLoginDate: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false, collection: 'admins' });

module.exports = MONGOOSE.model('admins', adminSchema);
