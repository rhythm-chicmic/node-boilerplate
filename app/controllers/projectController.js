const { createSuccessResponse, createErrorResponse } = require("../helpers");
const { projectService } = require("../services");
const { ERROR_TYPES } = require("../utils/constants");
const { SUCCESS, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND } = require("../utils/messages");


const projectSend = async (payload) => {
    try {
        const projectBody = await projectService.createProject(payload);
        return createSuccessResponse(SUCCESS, {...projectBody})
    }
    catch(e) {
        console.log(e);
        return createErrorResponse(
            INTERNAL_SERVER_ERROR,
            ERROR_TYPES.INTERNAL_SERVER_ERROR,
            {}
        );
    }

};

const projectUpdate = async (payload) => {
        const _id = payload._id;
        const isProjectExists = await projectService.findOne({ _id: _id });
        if(!isProjectExists) {
            return createErrorResponse(
                PROJECT_NOT_FOUND,
                ERROR_TYPES.DATA_NOT_FOUND,
            )
        }
        console.log(payload);
        const projectBody = await projectService.findOneAndUpdate({ _id: _id },
            {
                $set : payload
                
            },
            { new: true }
        );
        return createSuccessResponse(SUCCESS, projectBody)
}

const projectDelete = async (payload) => {
    const _id = payload._id;
    const isProjectExists = await projectService.findOne({ _id: _id });
    if(!isProjectExists){
        return createErrorResponse(
            PROJECT_NOT_FOUND,
            ERROR_TYPES.DATA_NOT_FOUND
        )
    }
    await projectService.findOneAndDelete({_id:_id});

    return createSuccessResponse(SUCCESS, { message: 'Project Deleted Successfully' })
}

const projectGet = async (payload) => {
    const totalDocuments = await projectService.countDocuments();
    await projectService.find({})
    return createSuccessResponse(SUCCESS, { message: 'Project Successfully', totalCount: totalDocuments });

}

module.exports = { projectSend, projectUpdate, projectDelete, projectGet };