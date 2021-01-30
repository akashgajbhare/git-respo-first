/**
 * Member.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


module.exports = {

	attributes: {

	//  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
	//  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
	//  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

		memberid: {type: 'number', unique: true},
		membershipno: {type: 'number', unique: true},
		membername: {type: 'string', required: true},
		pfindex: {type: 'number', defaultsTo: 0},
		phone: {type: 'string', /*unique: true*/},	//	mapped as contact in foxpro
		email_id: {type: 'string'},
		nominee: {type: 'string'},
		kycdone: {type: 'boolean'},
		ressaddr1: {type: 'string'},
		ressaddr2: {type: 'string'},
		ressaddr3: {type: 'string'},
		resspin: {type: 'number'},
		birthdate: {type: 'number', defaultsTo: -1},
		joindate: {type: 'number', defaultsTo: -1},
		bankacc: {type: 'string'},
		branch_id: {type: 'number'},
		designation: {type: 'string'},
		status: {type: 'string'},
		token: {
			type: 'string'
		},
		enabled: {
			type: 'boolean',
			defaultsTo: true
		},


	//  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
	//  ║╣ ║║║╠╩╗║╣  ║║╚═╗
	//  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


	//  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
	//  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
	//  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

	},

};
