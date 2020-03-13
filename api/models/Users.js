/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    uid: {
      type: 'number',
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },

    email: {
      type: 'string',
      allowNull: false,
      unique: true,
      required: true,
    },

    password: {
      type: 'string',
      allowNull: false,
      unique: false,
      required: true,
      encrypt: true,
    },

    userName: {
      type: 'string',
      allowNull: false,
      unique: false,
      required: true,
    },

    age: {
      type: 'number',
      allowNull: false,
      unique: false,
      required: true,
    },

    phoneNumber: {
      type: 'text',
      allowNull: false,
      unique: true,
      required: true,
    },

    bloodGroup: {
      type: 'text',
      allowNull: false,
      unique: false,
    }

  },

};

