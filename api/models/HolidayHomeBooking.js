/**
 * HolidayHomeBooking.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


module.exports = {

	attributes: {

	//  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
	//  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
	//  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

		holidayhome: {
			type: 'string', 
			required: true
		},
		member: {
			model: 'Member',
			required: true
		},
		date: {
			type: 'number',
			'required': true
		},
		days: {
			type: 'number',
			defaultsTo: 1
		},
		rooms: {
			type: 'number',
			defaultsTo: 1
		},
		status: {
			type: 'string',
			defaultsTo: 'Pending'
		},
		reason: {
			type: 'string'
		}


	//  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
	//  ║╣ ║║║╠╩╗║╣  ║║╚═╗
	//  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


	//  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
	//  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
	//  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

	},

};
