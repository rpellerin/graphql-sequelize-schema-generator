const graphqlSchemaGenerator = require('../src/graphql-sequelize-schema-generator')
const models = require('./models')

it('outputs the correct schema', () => {
  const schema = graphqlSchemaGenerator(models)
  expect(schema).toMatchSnapshot()
})
