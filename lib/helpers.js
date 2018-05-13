module.exports.getJWT = function(authorization) {
    const HEADER_REGEX = /bearer (.*)$/i;
    const temp = HEADER_REGEX.exec(authorization);
    return (temp && temp[1] ) || null;
};
