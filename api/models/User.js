/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt-nodejs');

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

	name: {
		type: 'string',
		required: true
	},
	email: {
		type: 'string',
		//required: true,
		unique: true
	},
	phone: {
		type: 'number',
		required: true,
		unique: true
	},
	password: {
		type: 'string',
		required: true
	},
	enabled: {
		type: 'boolean',
		defaultsTo: true
	},

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

	role: {
		type: 'string',
		required: true,
	},
	  
	resettime: {
		type: 'number',
		defaultsTo: 0
	}

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

  customToJSON: function() {
     return _.omit(this, ['password'])
  },
	beforeUpdate: function(valuesToSet, proceed) {
		//	We have to update the record for password only if there are passwords provided.
		if(valuesToSet.password && valuesToSet.password.length > 0) {
			bcrypt.genSalt(10, function(err, salt){
				bcrypt.hash(valuesToSet.password, salt, null, function(err, hash){
					if(err) return proceed(err);
					valuesToSet.password = hash;
					return proceed();
				});
			});
		} else {
			return proceed();
		}
	},
  beforeCreate: function(user, cb){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, null, function(err, hash){
        if(err) return cb(err);
        user.password = hash;
        return cb();
      });
    });
  }
};
