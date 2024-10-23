const { createErrorResponse, createSuccessResponse } = require("../helpers");
const { auth1Service } = require("../services");
const { ERROR_TYPES } = require("../utils/constants");
const { AUTH, SUCCESS } = require("../utils/messages");
const { encryptJwt, decryptJwt } = require("../utils/utils");



const authSignup = async (payload) => {

    const { email, userName } = payload;

    const isUniqueUser = await auth1Service.findOne({ email: email, userName: userName });

    if(isUniqueUser && isUniqueUser.length){
        return createErrorResponse(AUTH.UNIQUE_CREDENTIALS_REQUIRED , ERROR_TYPES.BAD_REQUEST);
    }

    const userData = await auth1Service.createUser(payload);
    console.log(userData);
    const createUserToken =  encryptJwt(userData?.id);

    return createSuccessResponse(SUCCESS, { token: createUserToken });

};

const authLogin = async (payload) => {
    const { email, userName, password, authorization } = payload;

    const tokenData = decryptJwt(authorization);
    if(!tokenData){
        return createErrorResponse(AUTH.TOKEN_EXPIRED, ERROR_TYPES.UNAUTHORIZED);
    }
    const userId = tokenData.id;
    const userData = await auth1Service.findOne( { _id : userId, email: email, userName: userName, password: password });

    if(userData){
        return createSuccessResponse(SUCCESS);
    }
    return createErrorResponse(AUTH.CREDENTIALS_NOT_MATCHED, ERROR_TYPES.BAD_REQUEST)

}


module.exports = { authSignup, authLogin }