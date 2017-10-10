/* eslint-disable import/prefer-default-export */

// Bcrypt hashing functions

// ----------------------
// IMPORTS

/* NPM */

// Bcrypt hashing, for use with passwords
const bcrypt = require('bcrypt');

// JSON web tokens
const jwt = require('jsonwebtoken');

// ----------------------

// JWT secret key -- do not expose this!  It's generally a better idea to
// have secret keys set by environment vars and not baked into the code, but
// for the sake of brevity, we'll keep this as a constant for now
const { JWT_SECRET } = require('./consts');

// Number of rounds to run the bcrypt hashing.  The bigger this number, the
// longer it'd take to compare hashes (and thus, the securer it is.)  However,
// bigger numbers also mean longer waiting times when logging in -- 10 is
// generally considered reasonable for today's hardware
const ROUNDS = 10;

/* BCRYPT */

// Generate a password hash, using the bcrypt library.  We wrap this in a
// Promise to avoid using bcrypt's default callbacks
module.exports.generatePasswordHash =  async function(plainTextPassword) {
  return new Promise((ok, reject) => {
    bcrypt.genSalt(ROUNDS, (saltError, salt) => {
      if (saltError) return reject(saltError);
      return bcrypt.hash(plainTextPassword, salt, (hashError, hash) => {
        if (saltError) return reject(saltError);
        return ok(hash);
      });
    });
  });
}

// Check a hashed password
module.exports.checkPassword =  async function(plainTextPassword, hash) {
  return new Promise((ok, reject) => (
    bcrypt.compare(plainTextPassword, hash, (e, doesMatch) => {
      if (e) return reject(e);
      return ok(doesMatch);
    })
  ));
}

/* JWT */

// Sign a JWT.  Pass in an object, which will be publicly visible.
module.exports.encodeJWT = function(data) {
  return jwt.sign(data, JWT_SECRET);
}

// Verify a JWT.  Note:  This can throw an error if the token is invalid,
// so always catch it!
module.exports.decodeJWT = function(token) {
  return jwt.verify(token, JWT_SECRET);
}
