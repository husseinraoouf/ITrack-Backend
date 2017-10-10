const  isEmail = require('isemail');
const {
  ObjectID
} = require('mongodb');
/* Local */

// Bcrypt hashing, for use with passwords
const { generatePasswordHash } = require('../lib/hash');

// Error handler
const FormError = require('../lib/error');


module.exports = ({ Users }, { userByID }) => {
    
    let methods = {}
    
    methods.getAll = async () => await Users.find({}).toArray();

    methods.getByID = async (id) => await Users.findOne({ _id: id});

    methods.deleteUser = async ({id}) => {
        await Users.remove({ _id: new ObjectID(id) });
        return "OK"
    }

    // 3
    methods.createUser =  async (data) => {
        // Create a blank `FormError` instance, in case we need it
        const e = new FormError();

        /* Sanity check for input */

        // E-mail
        if (!data.authProvider.email) {
            e.set('email', 'Please enter your e-mail address.');
        } else if (!isEmail.validate(data.authProvider.email)) {
            e.set('email', 'Please enter a valid e-mail.');

            // Check that the e-mail isn't already taken
        } else if (await Users.findOne({ email: data.authProvider.email })) {
            e.set('email', 'Your e-mail belongs to another account. Please login instead.');
        }

        // Password
        if (!data.authProvider.password) {
            e.set('password', 'Please enter a password');
        } else if (data.authProvider.password.length < 6 || data.authProvider.password.length > 64) {
            e.set('password', 'Please enter a password between 6 and 64 characters in length');
        }

        // Name
        if (!data.name) {
            e.set('name', 'Please enter your first name.');
        } else if (data.name.length < 2 || data.name.length > 32) {
            e.set('name', 'Your name needs to be between 2-32 characters in length.');
        }

        // Do we have an error?
        e.throwIf();

        // All good - proceed
        const newUser = {
            name: data.name,
            email: data.authProvider.email,
            password: await generatePasswordHash(data.authProvider.password),
            linkedAccounts: null,
            bios: null,
            image: null,
            cover: null,
            tracks: null,
        };
        const response = await Users.insert(newUser);
        return Object.assign({ id: response.insertedIds[0] }, newUser);
    }

    methods.createUserFromSocial = async (data) => {
              console.log("ASd");
        const existingUser = await Users.findAndModify(
            { linkedAccounts: { $elemMatch: { provider: data.linkedAccounts[0].provider, email: data.linkedAccounts[0].email } } },
            [],
            { $set: { "linkedAccounts.$.token": data.linkedAccounts[0].token } },
            { new: true } 
        );

        if (existingUser.value) return existingUser.value;
        

        // Nope -- let's create one

        // All good - proceed
         const newUser = {
            name: data.name,
            email: null,
            linkedAccounts: data.linkedAccounts,
            password: null,
            bios: null,
            image: null,
            cover: null,
            tracks: null,
        };
        const response = await Users.insert(newUser);
        return Object.assign({ id: response.insertedIds[0] }, newUser);
    }
    
    return methods;
};
