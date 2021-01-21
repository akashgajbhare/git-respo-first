/**
 * Relations.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    self_id: {
      type:"string",
      required :true,
    },
    relative_id : {
      type : "string",
      required : true,
    },
    relationship : {
      type : "string",
      required : true
    },
    status : {
      type : "string",
      defaultsTo : "Pending"
    }
  },

};

