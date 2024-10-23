'use strict';

const { projectController } = require('../../controllers');
const { Joi } = require('../../utils/joiUtils');

module.exports= [
    {
        method: "POST",
        path: '/project',
        joiSchemaForSwagger: {
            group: "Project",
            description: "Route For Creating New Project",
            model: "Project",

            body: {
                projectName: Joi.string().required(),
                companyName: Joi.string(),
                clientName: Joi.string(),
                mode: Joi.number().modeValid(1,2).required(),
                startDate: Joi.date().required(),
                endDate: Joi.date(),
                projectManager: Joi.string().required(),
                projectStatus: Joi.number().default(1),
                paStatus: Joi.number().default(1),
            },
        },
        handler:  projectController.projectSend
    },
    {
        method: "PUT",
        path: '/project/:_id',
        joiSchemaForSwagger: {
            group: "Project",
            description: "Route For Updating Existing Project",
            model: "Project",
            params: {
                _id: Joi.string().objectId().required()
            },
            body: {
                projectName: Joi.string().required(),
                companyName: Joi.string(),
                clientName: Joi.string(),
                mode: Joi.number().modeValid(1,2).required(),
                startDate: Joi.date().required(),
                endDate: Joi.date(),
                projectManager: Joi.string().required(),
                projectStatus: Joi.number().default(1),
                paStatus: Joi.number().default(1),
            },
        },
        handler:  projectController.projectUpdate
    },
    {
        method: "DELETE",
        path: '/project/:_id',
        joiSchemaForSwagger: {
            group: "Project",
            description: "Route For Delete Existing Project",
            model: "Project",
            params: {
                _id: Joi.string().objectId().required()
            }
        },
        handler:  projectController.projectDelete
    },
    {
        method: "GET",
        path: '/project',
        joiSchemaForSwagger: {
            group: "Project",
            description: "Route For Get All Existing Project",
            model: "Project"
        },
        handler:  projectController.projectGet
    }

    






]