var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const graphQlSchema = require('./graphql/schema')
var graphQlResolvers = require('./graphql/resolvers')
var app = express();

//Conexión a MongoDb
const mongoConnect = require('./util/database').mongoConnect;
mongoConnect(() => {});

//Data mock
//http://localhost:4000/mock?count=10
const faker = require('faker');
const _ = require('lodash');

app.get('/mock', (req, res) => {
  const count = req.query.count;
  if (!count) {
    return res
      .status(400)
      .send({ errorMsg: 'count query parameter is missing.' });
  }
  res.send(
    _.times(count, () => {
      const address = faker.address;
      const user = faker.name;
      const phone = faker.phone;

      return {
        name: user.firstName() + " " + user.lastName(),
        address: address.city(),
        email: faker.internet.email().toLowerCase(),
        phoneNumber: parseInt(phone.phoneNumber('########'))
      };
    })
  );
});

//Cors
let cors = require('cors')
app.use(cors())

//Graphql
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