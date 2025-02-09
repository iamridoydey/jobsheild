import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    password: String!
    role: String!
    isVerified: Boolean
    createdAt: Date!
    insertedFrauders: [ID!]
  }

  type HrSchema {
    name: String!
    account: String!
    accountUrl: String!
  }

  input HrSchemaInput {
    name: String!
    account: String!
    accountUrl: String!
  }

  type Link {
    key: String!
    value: String!
  }

  input LinkInput {
    key: String!
    value: String!
  }

  type Frauder {
    _id: ID!
    companyName: String!
    hrList: [HrSchema!]!
    logo: String
    importantLinks: [Link!]
    createdBy: ID!
    contributors: [ID!]
    isJustified: Boolean
    proofs: [ID!]!
    createdAt: Date
  }

  type Proof {
    _id: ID!
    frauderId: ID!
    submittedBy: ID!
    screenshots: [String!]
    description: String
    isJustified: Boolean
    createdAt: Date
  }

  type Query {
    getUsers: [User]
    getUser(id: ID, email: String, username: String): User
    getFrauders: [Frauder]
    getFrauder(id: ID, companyName: String): Frauder
    getProofs(frauderId: String!): [Proof]
  }

  type Mutation {
    createUser(
      name: String!
      username: String!
      email: String!
      password: String!
    ): User
    updateUser(
      id: ID!
      name: String
      username: String
      email: String
      password: String
      role: String
    ): User
    deleteUser(id: ID!): User
    createFrauder(
      companyName: String!
      hrList: [HrSchemaInput!]!
      logo: String
      contributors: [ID!]
      importantLinks: [LinkInput!]
      createdBy: ID!
    ): Frauder
    updateFrauder(
      id: ID!
      userId: ID
      companyName: String
      hrList: [HrSchemaInput!]
      logo: String
      importantLinks: [LinkInput!]
    ): Frauder
    deleteFrauder(id: ID!, userId: ID!): Frauder
    createProof(
      frauderId: ID!
      submittedBy: ID!
      screenshots: [String!]!
      description: String
      isJustified: Boolean
    ): Proof
    updateProof(
      id: ID!
      frauderId: ID!
      screenshots: [String!]
      description: String
      isJustified: Boolean
    ): Proof
    deleteProof(id: ID!): Proof

    # Email verification
    sendVerificationEmail(email: String!): Boolean
    verifyCode(email: String!, code: String!): User
  }
`;

export default typeDefs;
