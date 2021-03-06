const express = require('express');
const bodyParser = require('body-parser');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
const schema = require('./schema');
const cors = require('cors');
const {getJWT} = require('./lib/helpers');


const connectDB = require('./db');


const start = async () => {
    const DB = await connectDB();
    const app = express();
    app.use(cors());

    const buildOptions = (req, res) => {
        const jwt = getJWT(req.headers.authorization);
        return {
            context: {...DB, jwt}, // This context object is passed to all resolvers.
            schema,
        };
    };

    app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

    app.use('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
    }));

    const PORT = process.argv[2] || 5000;
    app.listen(PORT, () => {
        console.log(`GraphQL server running on port ${PORT}.`);
    });
};

// 5
start();
