'use strict'

const { projectModel } = require('../models');
const { NORMAL_PROJECTION } = require('../utils/constants');

const projectService = {};

projectService.createProject = async(criteria) => await projectModel.create(criteria);

projectService.find = async (criteria, projection= NORMAL_PROJECTION) => await projectModel.find(criteria,projection).lean();

projectService.findOne = async (criteria, projection= NORMAL_PROJECTION) => await projectModel.findOne(criteria,projection).lean();

projectService.countDocuments = async () => await projectModel.countDocuments();

/**
 * @returns function to find the data and update it
 */
projectService.findOneAndUpdate = async (criteria, dataToUpdate, options ={ new : true}) => await projectModel.findOneAndUpdate(criteria,dataToUpdate, options).lean();

projectService.findOneAndDelete = async (criteria, dataToDelete, options) => await projectModel.findByIdAndDelete(criteria, dataToDelete, options).lean();


module.exports = projectService;