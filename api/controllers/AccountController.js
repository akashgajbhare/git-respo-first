/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	
	enquirylist: async function(req, res) {
		res.view('enquirylist');	
	},
};

