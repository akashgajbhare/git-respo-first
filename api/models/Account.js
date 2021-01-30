/**
 * Account.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


module.exports = {

	attributes: {

	//  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
	//  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
	//  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

		account_id: {type: 'number', unique: true},
		account_name: {type: 'string'},
		drcr: {type: 'string'},

	//  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
	//  ║╣ ║║║╠╩╗║╣  ║║╚═╗
	//  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


	//  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗	
	//  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
	//  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

	},

};
