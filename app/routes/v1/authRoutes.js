'use strict';

const { Joi } = require('../../utils/joiUtils');
const { authController } = require('../../controllers');


module.exports = [
    {
        method: "POST",
        path: "/signup",
        joiSchemaForSwagger: {
            group: "Authentication",
            description: "Route For Creating New User",
            model: "Authentication",

            body: {
                firstName: Joi.string().required(),
                lastName: Joi.string(),
                password: Joi.string().required(),
                email: Joi.string().email().required(),
                userName: Joi.string().required(),
            },
        },
        handler: authController.authSignup
    },
    {
        method: "POST",
        path: '/login',
        joiSchemaForSwagger: {
            group: "Authentication",
            description: "Route For Login User",
            model: "Authentication",

            headers: {
				authorization: Joi.string().required().description('User\'s JWT token.')
			},
            body: {
                userName: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required()
            }
        },
        handler: authController.authLogin
    }


];