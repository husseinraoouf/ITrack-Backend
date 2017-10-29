const {
    ObjectID
  } = require('mongodb');
// Error handler
const FormError = require('../lib/error');
const { decodeJWT } = require('../lib/hash');


module.exports = ({ Tracks, SuggestedLinks }, { userByID }) => {

    let methods = {}

    // methods.getAll = async () => await Tracks.find({}).toArray();
    
    
    // methods.deleteTrack = async ({ id }, jwt) => {
    //     if (! (!!jwt && decodeJWT(jwt).permission == 0) ) {
    //         throw Error("You don't have permission");
    //     }

    //     await Fields.remove({ _id: new ObjectID(id) });
    //     return "OK"
    // }
    
    
    methods.createTrack = async (data, jwt) => {


        if (!jwt) {    
            throw Error("You don't have permission");
        } else {
            const user = decodeJWT(jwt);
            if(user) {
                data.madeByID = user.id;
            } else {
                throw Error("You don't have permission");        
            }
        }


//  name: String!,
//  description: String!,
//  image: String,
//  fieldID: String!, 
//  technologies: [String!]!,
//  reasons: String!,
//  chapters: [ChapterInput!]! 



        // Create a blank `FormError` instance, in case we need it
        const e = new FormError();

        /* Sanity check for input */

        if (data.name.length < 2 || data.name.length > 32) {
            e.set('name', 'Track name needs to be between 2-32 characters in length.');
        } else if (await Tracks.findOne({ name: data.name })) {
            e.set('name', 'Tracks name already exist.');
        }

        // Password
        if (data.description.length < 20 || data.description.length > 200) {
            e.set('description', 'Tracks description needs to be between 20-200 characters in length.');
        }

        if (data.image) {
            try {
                new URL(data.image);
            } catch (error) {
                e.set('image', 'Link validation error: invalid url.');
            }
        }

        data.fieldID = new ObjectID(data.fieldID);
        
        // data.chapters.forEach(function(element, i) {
        //     data.chapters[i] = Object.assign({ id: new ObjectID() }, element);
        // }, this);
        
        // Do we have an error?
        e.throwIf();

        const now = new Date();
        
        // All good - proceed
        const newField = {
            name: data.name,
            description: data.description,
            createdAt: now,
            updatedAt: now,
        };

        const response = await Fields.insert(newField);
        return Object.assign({ id: response.insertedIds[0] }, newField);
    
    }


    // methods.updateTrack = async (data, jwt) => {

    //     if (! (!!jwt && decodeJWT(jwt).permission == 0) ) {
    //         throw Error("You don't have permission");
    //     }


    //     // Create a blank `FormError` instance, in case we need it
    //     const e = new FormError();

    //     /* Sanity check for input */

    //     if (!data.name && !data.description) {
    //         e.set('update', 'Please provide either field name or description.');
    //     }

    //     if (data.name && ( data.name.length < 2 || data.name.length > 32) ) {
    //         e.set('name', 'Your name needs to be between 2-32 characters in length.');
    //     } else if (data.name && ( await Fields.findOne({ name: data.name } ) ) ) {
    //         e.set('name', 'Field name already exist.');
    //     }

    //     if (data.description && ( data.description.length < 20 || data.description.length > 200) ) {
    //         e.set('description', 'Field description needs to be between 20-200 characters in length.');
    //     }
    //     e.throwIf();

    //     const { id, ...change } = data;

    //     await Fields.update(
    //         {_id: new ObjectID(id)},
    //         {$set: { ...change, updatedAt: new Date() }}
    //     )
    
    //     return "OK";
    
    // }
    

    return methods;
};
