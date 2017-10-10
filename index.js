const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { parseUA, parseOS } = require('ua-parser')
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema');
const { decodeJWT } = require('./lib/hash');
const { JWT_COOKIE, FB_CLIENTID, FB_CLIENTSECRET } = require('./lib/consts');


// 1
const connectDB = require('./db');

// 2
const start = async () => {
    // 3
    const DB = await connectDB();
    var app = express();
    app.use(cookieParser())
    app.use(passport.initialize());

    passport.use(new FacebookStrategy({
        clientID: FB_CLIENTID,
        clientSecret: FB_CLIENTSECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: [
            'id',
            'email',
            'first_name',
        ],
    },
        async function (token, refreshToken, profile, done) {
            let user = {};
            try {
                user = await DB.userDB.createUserFromSocial({
                    name: profile.name.givenName,
                    linkedAccounts: [
                        {
                            provider: 'facebook',
                            email: profile.emails[0].value,
                            token
                        }
                    ]
                });
            } catch (e) {
                // eslint-disable-next-line
                console.log('User error:', e);
            }
            done(null, user);
        }
    ));

    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            // Since we're not using sessions, turn `session` off
            session: false,

            // Get access to the fields we need
            scope: [
                'public_profile',
                'email',
            ],
        })
    );

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
        async function (req, res) {


            const session = await DB.sessionDB.createSession(req.user, req.device);

            // Create a JWT token, and store it on our common cookie
            res.cookie(JWT_COOKIE, session.token, {
                expires: session.expiresAt,
            });

            // Successful authentication, redirect home.
            res.redirect('/graphiql');
        }
    );



    app.use( (req, res, next) => {
        const userAgent = req.headers['user-agent'];
        req.device = parseOS(userAgent).toString() + " " + parseUA(userAgent).toString();
        next();
    })

    const buildOptions = (req, res) => {
        const HEADER_REGEX = /bearer token-(.*)$/i;
        const jwt = req.cookies[JWT_COOKIE] || req.headers.authorization && HEADER_REGEX.exec(authorization)[1] || null;
        console.log(jwt);
        return {
            context: { ...DB, jwt, req, res, device: req.device }, // This context object is passed to all resolvers.
            schema,
        };
    };

    app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

    app.use('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
    }));

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`GraphQL server running on port ${PORT}.`)
    });
};

// 5
start();