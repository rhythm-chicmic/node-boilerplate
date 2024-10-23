'use strict';

/** ******************************
 ********* Import All routes ***********
 ******************************* */
const v1Routes = [
  ...require('./serverRoutes'),
  ...require('./projectRoutes'),
  ...require('./shortUrlRoutes'),
  ...require('./authRoutes')
];

module.exports = v1Routes;
