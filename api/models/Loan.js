/**
 * Loan.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


module.exports = {

	attributes: {

	//  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
	//  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
	//  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

		memberid: 	{type: 'number', unique: true},
		loandate: 	{type: 'number', required: true},
		grossloan: 	{type: 'number', defaultsTo: 0},
		netloan: 	{type: 'number', defaultsTo: 0},
		loanemi: 	{type: 'number', defaultsTo: 0},
		surety:		{type: 'json'},
		reason: 	{type: 'string'}

	//  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
	//  ║╣ ║║║╠╩╗║╣  ║║╚═╗
	//  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


	//  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗	
	//  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
	//  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

	},

};
