/**
 * UpdateProfile.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    phone : {
      type: 'string',
      unique: true,
    },
    first_Name : {
      type: 'string',
      required: true,
    },
    middle_Name :{
      type: 'string',
    },
    last_Name : {
      type: 'string',
      required: true,
    },
    dob :{
      type: "number"
    },
    address : {
      type : "string",
      required : true,
    },
    pincode : {
      type : "string",
      required : true,
    },
    state : {
      type : "string",
      required: true
    },
    city : {
      type : "string",
      required  : true,
    },
    photo : {
      type: "string",
    },
    // fcm_token : {
    //   type : 'string'
    // },
    enabled : {
      type : 'boolean',
      defaultsTo : true, 
    }
  },

};

