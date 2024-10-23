'use strict';

const { Joi } = require('../../utils/joiUtils');
const { shortUrlController } = require('../../controllers');

module.exports = [
  {
    method: 'POST',
    path: '/shorturl',
    joiSchemaForSwagger: {
      group: 'SHORT URL',
      description: 'Route to Create Short Url.',
      model: 'ShortUrl',
      body : {
          url: Joi.string().required()
      },
    },
    handler: shortUrlController.shortUrlCreate,
  },
  {
    method: 'GET',
    path: '/shorturl/:shortUrl',
    joiSchemaForSwagger: {
      group: 'SHORT URL',
      description: 'Route to Create Short Url.',
      model: 'ShortUrl',
      params : {
        shortUrl: Joi.string().required()
      },
    },
    handler: shortUrlController.shortUrlGet,
  }
];
