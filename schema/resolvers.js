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

        signinUserFromSocial: async (root, data, { sessionDB: { signinUserFromSocial } }) => {
            
            return await signinUserFromSocial(data);
        },


        createField: async (root, data, { fieldDB: { createField } }) => {
         
            return await createField(data);
        },

        deleteUser: async (root, data, { userDB: { deleteUser } }) => {
            return await deleteUser(data);
        },

        deleteField: async (root, data, { fieldDB: { deleteField } }) => {
            return await deleteField(data);
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