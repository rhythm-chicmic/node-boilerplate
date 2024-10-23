'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');

const { Schema } = MONGOOSE;

/** *********** Auth Model ********** */

const authSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    userName: { type: String }
}, { timestamps: true, version: false, collection: 'auth' });

module.exports = MONGOOSE.model('auth', authSchema);