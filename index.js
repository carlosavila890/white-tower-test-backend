var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const graphQlSchema = require('./graphql/schema')
var graphQlResolvers = require('./graphql/resolvers')

//Conexión a MongoDb
const mongoConnect = require('./util/database').mongoConnect;
mongoConnect(() => {});

//Graphql
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true,
  customFormatErrorFn(err) {
    if (!err.originalError)
      return err;

    const data = err.originalError.data;
    const message = err.message || 'An error ocurred.';
    const code = err.originalError.code || 500;
    return {message: message, status: code, data: data};
  }
}));
app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/graphql');