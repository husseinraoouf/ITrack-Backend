const {
    makeExecutableSchema
} = require('graphql-tools');
const resolvers = require('./resolvers');



const typeDefs = `
    type Query {
        allUsers: [User!]!
        session: Session

        allFields: [Field!]!
    }

    type Mutation {
        createUser(name: String!, authProvider: AUTH_PROVIDER_EMAIL!): User!
        signinUser(authProvider: AUTH_PROVIDER_EMAIL): SigninPayload!
        updateUser(id: String!, name: String, email: String, bios: String, image: String, cover: String, linkedAccounts: [linkedAccountInput!] ): Status!
        deleteUser(id: String!): Status!

        signinUserFromSocial(name: String!, socialAuthProvider: AUTH_PROVIDER_SOCIAL!): SigninPayload!


        createField(name: String!, description: String!): Field!
        updateField(id: String!, name: String, description: String): Status!
        deleteField(id: String!): Status!

        createTrack(name: String!, description: String!, image: String, fieldID: String!, technologies: [String!]!, reasons: String!, chapters: [ChapterInput!]! ): Track!
        updateTrack(id: String!, name: String, description: String): Status!
        deleteTrack(id: String!): Status!
    }

    type User {
        id: ID!
        name: String!
        email: String
        bios: String
        image: String
        cover: String
        linkedAccounts: [linkedAccount!]
        sessions: [Session!]
    }

    type Session {
        id: ID!
        user: User!
        token: String!
    }
    
    type linkedAccount {
        provider: String!
        email: String!
        token: String!
    }

    input linkedAccountInput {
        provider: String!
        email: String!
        token: String!
    }

    type Field {
        id: ID!
        name: String!
        description: String!
    }

    type Track {
        id: ID!
        name: String!
        description: String!
        image: String
        field: Field!
        madeBy: User!
        technologies: [String!]!
        reasons: String!
        chapters: [Chapter!]!
    }

    input AUTH_PROVIDER_EMAIL {
        email: String!
        password: String!
    }

    input AUTH_PROVIDER_SOCIAL {
        provider: String!
        email: String!
        token: String!
    }

    type Chapter {
        name: String!
        description: String!
        steps: [Step!]!
    }

    input ChapterInput {
        name: String!
        description: String!
        steps: [StepInput!]!
    }

    type Step {
        name: String!
        kind: StepKind!
        cost: Float!
        link: String!
        time: Int!
    }

    input StepInput {
        name: String!
        kind: StepKind!
        cost: Float!
        link: String!
        time: Int!
    }


    enum StepKind {
        Article
        Video
        Movie
    }

    type SigninPayload {
        token: String!
        user: User!
    }

    enum Status {
        OK
        FAILED
    }

`;




// Define your types here.
const typeDefs1 = `
    type Query {
        allUsers: [User!]!
        allFields(filter: FIELD_FILTER, skip: Int, first: Int): [Field!] !
        allTracks(filter: TRACK_FILTER, skip: Int, first: Int): [Track!] !
        allSkills(filter: SKILL_FILTER, skip: Int, first: Int): [Skill!] !
        allLinks(filter: LINK_FILTER, skip: Int, first: Int): [Link!] !
        allVotes: [Vote!]!

        User(id: String!): User!
        Field(id: String!): Field!
        Track(id: String!): Track!
        Skill(id: String!): Skill!
        Link(id: String!): Link!
        Vote(id: String!): Vote!
    }

    type Mutation {
        createUser(name: String!, authProvider: AUTH_PROVIDER_EMAIL!): User!
        createField(name: String!, description: String!): Field!
        createTrack(name: String!, description: String!, fieldID: String!, skills: [String!]!): Track!
        createSkill(name: String!, description: String!, url: String, level: Level!, links: [LINK_IN_SKILL!]): Skill!
        createLink(name: String!, description: String!, url: String!, skillID: String!): Link!
        createVote(linkID: String!): Vote!
        signinUser(authProvider: AUTH_PROVIDER_EMAIL): SigninPayload!
        
        deleteUser(id: String!): Status!
        deleteField(id: String!): Status!
        deleteTrack(id: String!): Status!
        deleteSkill(id: String!): Status!
        deleteLink(id: String!): Status!
        deleteVote(id: String!): Status!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        skills: [Skill]!
        registeredTracks: [Track]!
        madeTracks: [Track]!
        votes: [Vote!]!
        links: [Link]!
    }

    type Field {
        id: ID!
        name: String!
        description: String!
        tracks: [Track]!
    }
    
    type Track {
        id: ID!
        field: Field
        name: String!
        description: String!
        skills: [Skill]!
        madeBy: User!
        registeredStudents: [User]!
    }
    
    
    type Skill {
        id: ID!
        name: String!
        description: String!
        url: String
        level: Level!
        links: [Link]!
    }
    

    type Link {
        id: ID!
        name: String!
        url: String!
        description: String!
        skill: Skill!
        postedBy: User!
        votes: [Vote!]!
    }

    type Vote {
        id: ID!
        user: User!
        link: Link!
    }

    input AUTH_PROVIDER_EMAIL {
        email: String!
        password: String!
    }

    input LINK_IN_SKILL {
        name: String!
        description: String!
        url: String!
    }

    input FIELD_FILTER {
        OR: [FIELD_FILTER!]
        AND: [FIELD_FILTER!]
        name_contains: String
        description_contains: String
    }

    input TRACK_FILTER {
        OR: [TRACK_FILTER!]
        AND: [TRACK_FILTER!]
        name_contains: String
        description_contains: String
    }

    input SKILL_FILTER {
        OR: [SKILL_FILTER!]
        AND: [SKILL_FILTER!]
        name_contains: String
        description_contains: String
        inlevel: Level
    }

    input LINK_FILTER {
        OR: [LINK_FILTER!]
        AND: [LINK_FILTER!]
        name_contains: String
        description_contains: String
        url_contains: String
    }


    type SigninPayload {
        token: String
        user: User
    }
    
    enum Level {
        BEGINNER
        INTERMEDIATE
        EXPERT
    }

    enum Status {
        OK
        FAILED
    }

`;

// Generate the schema object from your types definition.
module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});