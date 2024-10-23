'use strict';

const { authModel } = require("../models");
const { NORMAL_PROJECTION } = require("../utils/constants");

const authenticateService = {};

authenticateService.findOne = async (criteria, projection = NORMAL_PROJECTION) => await authModel.findOne(criteria, projection).lean();

authenticateService.createUser = async (criteria) => await authModel.create(criteria);

authenticateService.validateUser = async () =>

module.exports =  authenticateService;