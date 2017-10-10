const DataLoader = require('dataloader');

// 2
module.exports = ({ Users, Sessions, Fields, Tracks }) => {
    
    async function batchByID(collection, keys) {
        return await collection.find({ _id: { $in: keys } }).toArray();
    }

    let methods = {}

    methods.userByID = new DataLoader(
        keys => batchByID(Users, keys),
        { cacheKeyFn: key => key.toString() },
    ),
    
    methods.fieldbyID = new DataLoader(
        keys => batchByID(Fields, keys),
        { cacheKeyFn: key => key.toString() },
    )

    methods.sessionByID = new DataLoader(
        keys => batchByID(Sessions, keys),
        { cacheKeyFn: key => key.toString() },
    )
    
    methods.trackByID =  new DataLoader(
        keys => batchByID(Tracks, keys),
        { cacheKeyFn: key => key.toString() },
    )

    return methods;
};
