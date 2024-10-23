const { shortUrlModel } = require("../models");
const { NORMAL_PROJECTION } = require("../utils/constants");


const shortUrlService = {};

shortUrlService.find = async (criteria, projection= NORMAL_PROJECTION) => await shortUrlModel.find(criteria, projection).lean();

shortUrlService.createShortUrl = async (criteria) => await shortUrlModel.create(criteria);


module.exports = shortUrlService;