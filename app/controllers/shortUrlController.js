const { createErrorResponse, createSuccessResponse } = require("../helpers");
const { shortUrlService } = require("../services");
const { SUCCESS, NOT_FOUND } = require("../utils/messages");
const { generateRandomString } = require("../utils/utils");
const config = require('../../config');

async function generateUniqueShortUrl() {
    const shortUrl = generateRandomString(6);
    const isShortUrlFound = await shortUrlService.find({ shortUrl: shortUrl });
    console.log(isShortUrlFound);
    if (isShortUrlFound && isShortUrlFound.length) {
        return generateUniqueShortUrl(shortUrlService); 
    }
    return shortUrl;
}

const shortUrlCreate = async (payload) => {
    const uniqueShortUrl = await generateUniqueShortUrl();
    console.log("Unique short URL generated:", uniqueShortUrl);
    payload['shortUrl'] = uniqueShortUrl;

    const shortUrlResponse = await shortUrlService.createShortUrl(payload); 
    shortUrlResponse['shortUrl'] = `${config.SERVER.PROTOCOL}://${config.SERVER.HOST}:${config.SERVER.PORT}/shorturl/${shortUrlResponse['shortUrl']}`;
    return createSuccessResponse(SUCCESS, shortUrlResponse);
}

const shortUrlGet= async (payload) => {
    const urlId = payload.shortUrl;
    const isUrlPresent = await shortUrlService.find({ shortUrl: urlId });
    if(!isUrlPresent){
        return createErrorResponse(
            SHORT_URL_NOT_FOUND,
            ERROR_TYPES.NOT_FOUND
        )
    }
    return {redirectUrl: isUrlPresent[0].url};

}


module.exports = { shortUrlCreate, shortUrlGet };

