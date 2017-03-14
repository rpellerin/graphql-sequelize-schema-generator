# graphql-sequelize-schema-generator

A helper function to automatically generate `GraphQLSchema` from Sequelize models.

## Installation

```bash
yarn add graphql-sequelize-schema-generator
```

or

```bash
npm install graphql-sequelize-schema-generator
```

## Usage

```javascript
var graphqlSchemaGenerator = require('graphql-sequelize-schema-generator')
var models = require('./models')
var schema = graphqlSchema(models)
```

### Example with Express

```javascript
const express = require('express')
const graphqlHTTP = require('express-graphql')
const graphqlSchemaGenerator = require('graphql-sequelize-schema-generator')
const models = require('./models')

var app = express()
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchemaGenerator(models),
    graphiql: true
  })
)

// ...
```
