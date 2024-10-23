'use strict';

/** *********** Modules ********** */
const MONGOOSE = require('mongoose');

const { Schema } = MONGOOSE;

/** *********** Project Model ********** */
const projectSchema = new Schema({
    projectName: { type : String },
    companyName: { type : String },
    clientName: { type: String },
    mode: { type: Number },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    projectManager: { type: String },
    projectStatus: { type: Number },
    paStatus: { type: Number }
}, { timestamps: true, version: false, collection: 'projects'  });

module.exports = MONGOOSE.model('projects', projectSchema);