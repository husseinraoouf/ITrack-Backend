function buildFilters({
    OR = [],
    AND = [],
}) {

    function buildONE({
        OR = [],
        name_contains,
        description_contains,
        inlevel,
        url_contains,
    }) {
        const filter = (name_contains || description_contains || inlevel || url_contains) ? [] : null;
        if (name_contains) {
            filter.push({
                "name": {
                    $regex: `.*${name_contains}.*`,
                    $options: 'i'
                }
            });
        }

        if (description_contains) {
            filter.push({
                "description": {
                    $regex: `.*${description_contains}.*`,
                    $options: 'i'
                }
            });
        }

        if (inlevel) {
            filter.push({
                "level": inlevel
            });
        }

        if (url_contains) {
            filter.push({
                "url": {
                    $regex: `.*${url_contains}.*`,
                    $options: 'i'
                }
            });
        }

        if (OR.length > 0) {
            filter.push({
                "$or": buildARR(OR)
            });
        }

        return filter
    }

    function buildARR(arr) {

        if (arr.length < 1) {
            return null
        }
        filtersOR = []

        for (let i = 0; i < arr.length; i++) {
            var filtersOR = filtersOR.concat(buildONE(arr[i]));
        }

        return filtersOR

    }

    let filters = {};

    if (OR.length > 0) {
        filters.$or = buildARR(OR)
    }

    if (AND.length > 0) {
        filters.$and = buildARR(AND)
    }


    return filters;
}

module.exports = {
    Query: {
        allUsers: async (root, data, { userDB: { getAll } }) => {
            return await getAll()
        },

        session: async (root, data, { jwt, sessionDB: { getByToken } }) => {
            return await getByToken(jwt);
        },

        allFields: async (root, data, { fieldDB: { getAll } }) => {
            return await getAll()
        },

    },

    Mutation: {
        createUser: async (root, data, { userDB: { createUser } }) => {

            return await createUser(data);
        },

        signinUser: async (root, data, { sessionDB: { login } }) => {
            
            return await login(data);
        },

        updateUser: async (root, data, { userDB: { updateUser }, jwt }) => {
            return await updateUser(data, jwt);
        },

        deleteUser: async (root, data, { userDB: { deleteUser }, jwt }) => {
            return await deleteUser(data, jwt);
        },

        signinUserFromSocial: async (root, data, { sessionDB: { signinUserFromSocial } }) => {
            
            return await signinUserFromSocial(data);
        },




        createField: async (root, data, { fieldDB: { createField }, jwt }) => {
            return await createField(data, jwt);            
        },

        updateField: async (root, data, { fieldDB: { updateField }, jwt }) => {
            return await updateField(data, jwt);    
        },


        deleteField: async (root, data, { fieldDB: { deleteField }, jwt }) => {
            return await deleteField(data, jwt);            
        },

        


        createTrack: async (root, data, { trackDB: { createTrack }, jwt }) => {
            return await createField(data, jwt);            
        },

        updateTrack: async (root, data, { trackDB: { updateTrack }, jwt }) => {
            return await updateField(data, jwt);    
        },

        deleteTrack: async (root, data, { trackDB: { deleteTrack }, jwt }) => {
            return await deleteField(data, jwt);            
        },



    },

    User: {
        id: root => root._id || root.id,

        sessions: async (root, _, { sessionDB: { getByUserID } }) => {

            return await getByUserID(root._id);
        },

    },


    Session: {

        id: root => root._id || root.id,

        user: async (root, _, { userDB: { getByID } }) => {

            return await getByID(root.userID);
        },
    },


    Field: {
        id: root => root._id || root.id,
    },


};