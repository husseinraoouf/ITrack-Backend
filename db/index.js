const {
  MongoClient
} = require('mongodb');

const buildDataloaders = require('./dataloaders');

const buildUser = require('./user');
const buildSession = require('./session');
const buildTrack = require('./track');
const buildField = require('./field');

// 1
const { MONGO_URL } = require('../lib/consts');

// 2
module.exports = async() => {
  const db = await MongoClient.connect(MONGO_URL);
  const col = {
    Users: db.collection('Users'),
    Sessions: db.collection('Sessions'),
    Fields: db.collection('Fields'),
    Tracks: db.collection('Tracks'),
    SuggestedLinks: db.collection('SuggestedLinks'),
  };

  const dataloaders = buildDataloaders(col);

  const userDB = buildUser(col, dataloaders);
  const sessionDB = buildSession(col, dataloaders);
  const trackDB = buildTrack(col, dataloaders);
  const fieldDB = buildField(col, dataloaders);


  return {
    userDB,
    sessionDB,
    trackDB,
    fieldDB,
  }

}
