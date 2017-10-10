const {
  ObjectID
} = require('mongodb');


// Error handler
const FormError = require('../lib/error');


module.exports = ({ Fields }, { userByID }) => {

    let methods = {}

    methods.getAll = async () => await Fields.find({}).toArray();


    methods.deleteField = async ({ id }) => {
        await Fields.remove({ _id: new ObjectID(id) });
        return "OK"
    }
    
    
    methods.createField = async (data) => {
        // Create a blank `FormError` instance, in case we need it
        const e = new FormError();

        /* Sanity check for input */

        // E-mail
        if (!data.name) {
            e.set('name', 'Please enter field name.');
        }

        // Password
        if (!data.description) {
            e.set('description', 'Please enter a description');
        }

        // Do we have an error?
        e.throwIf();

        // All good - proceed
        const newField = {
            name: data.name,
            description: data.description,
        };

        const response = await Fields.insert(newField);
        return Object.assign({ id: response.insertedIds[0] }, newField);
    
    }


    return methods;
};
