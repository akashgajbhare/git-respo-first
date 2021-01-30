/**
 * Checker.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


module.exports = {

	attributes: {

	//  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
	//  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
	//  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

		created_by: 	{type: 'string', required: true},
		approved_by: 	{type: 'string'},
		approved_on:	{type: 'number', defaultsTo: 0},
		completed_on:	{type: 'number', defaultsTo: 0},
		job_status: 	{type: 'string', defaultsTo: 'pending'},	//	pending, completed, working, declined, error
		job_type: 		{type: 'string', required: true},	//	fileupload
		job_inputs: 	{type: 'json', required: true},
		reason:			{type: 'string'}
		
	//  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
	//  ║╣ ║║║╠╩╗║╣  ║║╚═╗
	//  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


	//  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
	//  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
	//  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

	},

};
