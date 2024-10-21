'use strict';

/** ******************************
 **** Managing all the models ***
 ********* independently ********
 ******************************* */
module.exports = {
  sessionModel: require('./sessionModel'),
  userModel: require('./userModel'),
  dbVersionModel: require('./dbVersionModel'),
  adminModel: require('./adminModel'),
};
