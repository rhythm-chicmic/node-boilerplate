/* eslint-disable eqeqeq */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */

'use strict';

const MODELS = require('../models');
const CONFIG = require('../../config')
const { hashPassword } = require('../utils/utils');
const CONSTANTS = require('./constants');

const dbMigrations = {};

/**
 * Function to run migrationsfor database based on version number.
 * @returns
 */
dbMigrations.migerateDatabase = async () => {

  let dbVersion = await MODELS.dbVersionModel.findOne({});
  if (!dbVersion || dbVersion.version < 1) {
    await dbMigrations.createAdmin();
    dbVersion = await MODELS.dbVersionModel
      .findOneAndUpdate({}, { version: 1 }, { upsert: true, new: true });
  }
};

/**
 * Function to create admin
 * @returns 
 */
dbMigrations.createAdmin = async () => {
  const data = {
    email: CONFIG.ADMIN.EMAIL,
    password: hashPassword(CONFIG.ADMIN.PASSWORD),
    username: CONFIG.ADMIN.USERNAME,
  }
  await MODELS.adminModel(data).save()
  return;
};

module.exports = dbMigrations;
