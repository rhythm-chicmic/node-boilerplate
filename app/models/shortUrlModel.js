'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');

const { Schema } = MONGOOSE;

/** *********** Short Url Model ********** */
const shortUrlSchema = new Schema({
    url: { type: String },
    shortUrl: { type: String }
}, { timestamps: true, version: false, collection: 'shortUrl'  });

module.exports = MONGOOSE.model('shortUrl', shortUrlSchema);