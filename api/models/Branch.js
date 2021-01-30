/**
 * Branch.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


module.exports = {

	attributes: {

	//  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
	//  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
	//  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

		branchid: {type: 'number', unique: true},
		branchname: {type: 'string'},
		branchaddr1: {type: 'string'},
		branchaddr2: {type: 'string'},
		branchaddr3: {type: 'string'},
		branchpin: {type: 'number'},
		
	//  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
	//  ║╣ ║║║╠╩╗║╣  ║║╚═╗
	//  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


	//  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
	//  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
	//  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

	},

};
