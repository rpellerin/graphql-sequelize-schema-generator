'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('graphql'),
    GraphQLObjectType = _require.GraphQLObjectType,
    GraphQLList = _require.GraphQLList;

var _require2 = require('graphql-sequelize'),
    resolver = _require2.resolver,
    attributeFields = _require2.attributeFields;

/**
 * Returns the association fields of an entity.
 *
 * It iterates over all the associations and produces an object compatible with GraphQL-js.
 * BelongsToMany and HasMany associations are represented as a `GraphQLList` whereas a BelongTo
 * is simply an instance of a type.
 * @param {*} associations A collection of sequelize associations
 * @param {*} types Existing `GraphQLObjectType` types, created from all the Sequelize models
 */


var generateAssociationFields = function generateAssociationFields(associations, types) {
  var fields = {};
  for (var associationName in associations) {
    var relation = associations[associationName];
    // BelongsToMany is represented as a list, just like HasMany
    var type = relation.associationType === 'BelongsToMany' || relation.associationType === 'HasMany' ? new GraphQLList(types[relation.target.name]) : types[relation.target.name];

    fields[associationName] = {
      type: type,
      resolve: resolver(relation)
    };
  }
  return fields;
};

/**
 * Returns a new `GraphQLObjectType` created from a sequelize model.
 *
 * It creates a `GraphQLObjectType` object with a name and fields. The
 * fields are generated from its sequelize associations.
 * @param {*} model The sequelize model used to create the `GraphQLObjectType`
 * @param {*} types Existing `GraphQLObjectType` types, created from all the Sequelize models
 */
var generateGraphQLType = function generateGraphQLType(model, types) {
  return new GraphQLObjectType({
    name: model.name,
    fields: function fields() {
      return Object.assign(attributeFields(model), generateAssociationFields(model.associations, types));
    }
  });
};

/**
 * Returns a collection of `GraphQLObjectType` generated from Sequelize models.
 *
 * It creates an object whose properties are `GraphQLObjectType` created
 * from Sequelize models.
 * @param {*} models The sequelize models used to create the types
 */
var generateModelTypes = function generateModelTypes(models) {
  var types = {};
  for (var modelName in models) {
    // Only our models, not Sequelize nor sequelize
    if (models[modelName].hasOwnProperty('name') && modelName !== 'Sequelize') {
      types[modelName] = generateGraphQLType(models[modelName], types);
    }
  }
  return types;
};

/**
 * Returns a root `GraphQLObjectType` used as query for `GraphQLSchema`.
 *
 * It creates an object whose properties are `GraphQLObjectType` created
 * from Sequelize models.
 * @param {*} models The sequelize models used to create the root `GraphQLSchema`
 */
var generateQueryRootType = function generateQueryRootType(models, types) {
  var modelTypes = types || generateModelTypes(models);
  return new GraphQLObjectType({
    name: 'Root',
    fields: Object.keys(modelTypes).reduce(function (fields, modelTypeName) {
      var modelType = modelTypes[modelTypeName];
      return Object.assign(fields, _defineProperty({}, modelType.name + 's', {
        // TODO remove 's'
        type: new GraphQLList(modelType),
        resolve: resolver(models[modelType.name])
      }));
    }, {})
  });
};

var generateSchema = function generateSchema(models, types) {
  return {
    query: generateQueryRootType(models, types)
  };
};

module.exports = {
  generateModelTypes: generateModelTypes,
  generateSchema: generateSchema
};