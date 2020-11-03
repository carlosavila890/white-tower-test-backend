const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Query {
    GetContactList: [Contact]
    GetContact(contactId: String!): Contact
  }

  type Mutation {
    CreateContact(contactInput: CreateContactInputData): MongoDbId
    EditContact(contactInput: EditContactInputData): ApiResult
    DeleteContact(contactId: String!): ApiResult
  }

  input CreateContactInputData {
    name: String!
    address: String!
    phoneNumber: Int!
    email: String!
  }

  input EditContactInputData {
    contactId: String!
    name: String!
    address: String!
    phoneNumber: Int!
    email: String!
  }

  type Contact {
    _id: String
    name: String
    address: String
    phoneNumber: Int
    email: String
  }

  type MongoDbId {
    contactId: String
  }

  type ApiResult {
    code: Int
    message: String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);