'use strict';

/** ******************************
 * Managing all the controllers *
 ********* independently ********
 ******************************* */

module.exports = {
    serverController: require('./serverController'),
    projectController: require('./projectController'),
    shortUrlController: require('./shortUrlController'),
    authController: require('./authController')
};
