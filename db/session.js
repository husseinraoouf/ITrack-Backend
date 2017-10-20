const isEmail = require('isemail');

/* Local */

// Hashing/JWT
const { checkPassword, encodeJWT } = require('../lib/hash');

// Error handler
const FormError = require('../lib/error');


module.exports = ({ Sessions, Users }) => {
    
    let methods = {}

    methods.getByToken = async (jwt) => await Sessions.findOne({ token: jwt });

    methods.getByUserID = async (id) => await Sessions.find({ userID: id }).toArray();


    methods.createSession = async (user) => {
        
        // All good - proceed

        const expire = new Date();
        expire.setDate(expire.getDate() + 30);

        const newSession = {
            user: user,
            token: encodeJWT({
                id: user._id,
                name: user.name,
                image: user.image
            }),
            expiresAt: expire,
        };
        const response = await Sessions.insert(newSession);
        return Object.assign({ id: response.insertedIds[0] }, newSession);
        
    }

    methods.login = async (data) => {

        const e = new FormError();

        /* Validate data */

        // Email
        if (!data.authProvider.email) {
            e.set('email', 'Please enter your e-mail address.');
        } else if (!isEmail.validate(data.authProvider.email)) {
            e.set('email', 'Please enter a valid e-mail.');
        }

        // Password
        if (!data.authProvider.password) {
            e.set('password', 'Please enter your password.');
        } else if (data.authProvider.password.length < 6 || data.authProvider.password.length > 64) {
            e.set('password', 'Please enter a password between 6 and 64 characters in length');
        }

        // Any errors?
        e.throwIf();

        // Attempt to find the user based on the e-mail address
        const user = await Users.findOne({
                email: data.authProvider.email,
        });

        // If we don't have a valid user, throw.
        if (!user) {
            e.set('email', 'An account with that e-mail does not exist. Please check and try again');
        }

        e.throwIf();

        // Check that the passwords match
        if (!await checkPassword(data.authProvider.password, user.password)) {
            e.set('password', 'Your password is incorrect. Please try again or click "forgot password".');
        }

        e.throwIf();

        // Create the new session
        return methods.createSession(user);
    }

    return methods;
}
