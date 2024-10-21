'use strict';

/** ******************************
 **** Managing all the services ***
 ********* independently ********
 ******************************* */
module.exports = {
    dbService: require('./dbService'),
    swaggerService: require('./swaggerService'),
    authService: require('./authService'),
    fileUploadService: require('./fileUploadService'),
    stripeService: require('./stripeService'),
};
