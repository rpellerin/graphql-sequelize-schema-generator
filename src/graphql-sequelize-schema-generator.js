const {
  GraphQLObjectType,
  GraphQLList
} = require('graphql')
const {resolver, attributeFields} = require('graphql-sequelize')

/**
 * Returns the association fields of an entity.
 *
 * It iterates over all the associations and produces an object compatible with GraphQL-js.
 * BelongsToMany and HasMany associations are represented as a `GraphQLList` whereas a BelongTo
 * is simply an instance of a type.
 * @param {*} associations A collection of sequelize associations
 * @param {*} types Existing `GraphQLObjectType` types, created from all the Sequelize models
 */
const generateAssociationFields = (associations, types) => {
  let fields = {}
  for (let associationName in associations) {
    const relation = associations[associationName]
    // BelongsToMany is represented as a list, just like HasMany
    const type = relation.associationType === 'BelongsToMany' ||
      relation.associationType === 'HasMany'
      ? new GraphQLList(types[relation.target.name])
      : types[relation.target.name]

    fields[associationName] = {
      type,
      resolve: resolver(relation)
    }
  }
  return fields
}

/**
 * Returns a new `GraphQLObjectType` created from a sequelize model.
 *
 * It creates a `GraphQLObjectType` object with a name and fields. The
 * fields are generated from its sequelize associations.
 * @param {*} model The sequelize model used to create the `GraphQLObjectType`
 * @param {*} types Existing `GraphQLObjectType` types, created from all the Sequelize models
 */
const generateGraphQLType = (model, types) =>
  new GraphQLObjectType({
    name: model.name,
    fields: () =>
      Object.assign(
        attributeFields(model),
        generateAssociationFields(model.associations, types)
      )
  })

/**
 * Returns a collection of `GraphQLObjectType` generated from Sequelize models.
 *
 * It creates an object whose properties are `GraphQLObjectType` created
 * from Sequelize models.
 * @param {*} models The sequelize models used to create the types
 */
const generateModelTypes = models => {
  let types = {}
  for (let modelName in models) {
    // Only our models, not Sequelize nor sequelize
    if (models[modelName].hasOwnProperty('name') && modelName !== 'Sequelize') {
      types[modelName] = generateGraphQLType(models[modelName], types)
    }
  }
  return types
}

/**
 * Returns a root `GraphQLObjectType` used as query for `GraphQLSchema`.
 *
 * It creates an object whose properties are `GraphQLObjectType` created
 * from Sequelize models.
 * @param {*} models The sequelize models used to create the root `GraphQLSchema`
 */
const generateQueryRootType = models => {
  const modelTypes = generateModelTypes(models)
  return new GraphQLObjectType({
    name: 'Root',
    fields: Object.keys(modelTypes).reduce(
      (fields, modelTypeName) => {
        const modelType = modelTypes[modelTypeName]
        return Object.assign(fields, {
          [modelType.name + 's']: {
            // TODO remove 's'
            type: new GraphQLList(modelType),
            resolve: resolver(models[modelType.name])
          }
        })
      },
      {}
    )
  })
}

module.exports = models => ({
  query: generateQueryRootType(models)
})
