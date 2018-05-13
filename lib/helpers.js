module.exports.getJWT = function(authorization) {
    const HEADER_REGEX = /bearer (.*)$/i;
    return ( authorization && authorization != 'null' && HEADER_REGEX.exec(authorization)[1] ) || null;
};
