const  isEmail = require('isemail');
const {URL} = require('url');
const {
  ObjectID
} = require('mongodb');
const { decodeJWT } = require('../lib/hash');


/* Local */

// Bcrypt hashing, for use with passwords
const { generatePasswordHash } = require('../lib/hash');

// Error handler
const FormError = require('../lib/error');


module.exports = ({ Users }, { userByID }) => {
    
    let methods = {}
    
    methods.getAll = async () => await Users.find({}).toArray();

    methods.getByID = async (id) => await Users.findOne({ _id: id});

    methods.deleteUser = async ({id}, jwt) => {

        if (! ( !!jwt && (decodeJWT(jwt).permission == 0 || decodeJWT(jwt).id == data.id) )) {
            throw Error("You don't have permission");
        }

        await Users.remove({ _id: new ObjectID(id) });
        return "OK"
    }

    // 3
    methods.createUser =  async (data) => {
        // Create a blank `FormError` instance, in case we need it
        const e = new FormError();

        /* Sanity check for input */

        // E-mail
        if (!isEmail.validate(data.authProvider.email)) {
            e.set('email', 'Please enter a valid e-mail.');

            // Check that the e-mail isn't already taken
        } else if (await Users.findOne({ email: data.authProvider.email })) {
            e.set('email', 'Your e-mail belongs to another account. Please login instead.');
        }

        // Password
        if (data.authProvider.password.length < 6 || data.authProvider.password.length > 64) {
            e.set('password', 'Please enter a password between 6 and 64 characters in length');
        }

        // Name
        if (data.name.length < 2 || data.name.length > 32) {
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
            permission: 0,
        };
        const response = await Users.insert(newUser);
        return Object.assign({ id: response.insertedIds[0] }, newUser);
    }


    methods.updateUser = async (data, jwt) => {

        if (! (!!jwt && decodeJWT(jwt).id == data.id)) {
            throw Error("You don't have permission");
        }

        // Create a blank `FormError` instance, in case we need it
        const e = new FormError();

        /* Sanity check for input */

        if (!data.name && !data.email && !data.bios && !data.image && !data.cover && !data.linkedAccounts) {
            e.set('update', 'Please provide a field to update.');
        }

        if (data.email && !isEmail.validate(data.email)) {
            e.set('email', 'Please enter a valid e-mail.');

            // Check that the e-mail isn't already taken
        } else if (data.email && await Users.findOne({ email: data.email })) {
            e.set('email', 'Your e-mail belongs to another account. Please login instead.');
        }

        if (data.name && (data.name.length < 2 || data.name.length > 32)) {
            e.set('name', 'Your name needs to be between 2-32 characters in length.');
        }


        if (data.bios && (data.bios.length < 2 || data.bios.length > 200)) {
            e.set('name', 'Your bios needs to be between 2-200 characters in length.');
        }

        if (data.image) {
            try {
                new URL(data.image);
            } catch (error) {
                e.set('image', 'Link validation error: invalid url.');
            }
        }

        if (data.cover) {
            try {
                new URL(data.image);
            } catch (error) {
                e.set('cover', 'Link validation error: invalid url.');
            }
        }
        

        e.throwIf();

        const { id, ...change } = data;

        await Users.update(
            {_id: new ObjectID(id)},
            {$set: { ...change, updatedAt: new Date() }}
        )
    
        return "OK";
    
    }
    
    return methods;
};
