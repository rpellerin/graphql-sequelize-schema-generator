# graphql-sequelize-schema-generator

A helper function that automatically generates `GraphQLSchema` from Sequelize models.

[![npm version](https://badge.fury.io/js/graphql-sequelize-schema-generator.svg)](https://badge.fury.io/js/graphql-sequelize-schema-generator)
[![Build Status](https://travis-ci.org/rpellerin/graphql-sequelize-schema-generator.svg?branch=master)](https://travis-ci.org/rpellerin/graphql-sequelize-schema-generator)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## Installation

```bash
yarn add graphql-sequelize-schema-generator
```

or

```bash
npm install graphql-sequelize-schema-generator
```

## Prerequisites

This package assumes you have `graphql` and `sequelize` already installed (both packages are declared as `dependencies` and `peerDependencies`).

## Usage

```javascript
var {generateModelTypes, generateSchema} = require('graphql-sequelize-schema-generator')
var models = require('./models')
var schema = generateSchema(models) // Generates the schema
// OR
var types = generateModelTypes(models)
var schema = generateSchema(models, types) // Generates the schema by reusing the types
```

### Example with Express

```javascript
var { GraphQLSchema } = require('graphql')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const {generateSchema} = require('graphql-sequelize-schema-generator')
const models = require('./models')

var app = express()

app.use(
  '/graphql',
  graphqlHTTP({
    schema: new GraphQLSchema(generateSchema(models)),
    graphiql: true
  })
)

app.listen(8080, function() {
  console.log('RUNNING ON 8080')
})
```
