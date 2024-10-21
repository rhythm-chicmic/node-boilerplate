'use strict';

const { Joi } = require('../../utils/joiUtils');
const { serverController } = require('../../controllers');

module.exports = [
  {
    method: 'GET',
    path: '/server/check',
    joiSchemaForSwagger: {
      group: 'SERVER',
      description: 'Route to check server status.',
      model: 'ServerStatus',
    },
    handler: serverController.checkServerStatus,
  }
];
