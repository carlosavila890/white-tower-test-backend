const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Query {
    GetContactList(page: Int!, pageSize: Int!, search: [String], sortBy: String, sortDirection: String): ContactListResult
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
    phoneNumber: String!
    email: String!
  }

  input EditContactInputData {
    contactId: String!
    name: String!
    address: String!
    phoneNumber: String!
    email: String!
  }

  type Contact {
    _id: String
    name: String
    address: String
    phoneNumber: String
    email: String
  }

  type MongoDbId {
    contactId: String
  }

  type ApiResult {
    code: Int
    message: String
  }

  type ContactListResult {
    items: [Contact]
    totalCount: Int
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);