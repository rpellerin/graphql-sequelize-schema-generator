const {
  GraphQLSchema
} = require('graphql')
const graphqlSchemaGenerator = require('../src/graphql-sequelize-schema-generator')
const graphqlSchemaGenerator_build = require('../dist/graphql-sequelize-schema-generator')
const stringifier = require('stringifier')({maxDepth: 10, indent: '  '})
const models = require('./models')

it('outputs the correct schema', () => {
  const schema = graphqlSchemaGenerator(models)
  expect(stringifier(schema)).toMatchSnapshot()
})

it('outputs the correct schema (build version)', () => {
  const schema_build = graphqlSchemaGenerator_build(models)
  expect(stringifier(schema_build)).toMatchSnapshot()
})
