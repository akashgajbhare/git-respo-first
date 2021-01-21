/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  normalizeDigitsToTwo: function(n) {
		return n < 10 ? '0' + n : n; 
  },

  normalizeDigitsTo3Digits: function(n) {
		if(n < 10)
			return '00' + n;
		if(n < 100)
			return '0' + n;
		
		return n;
  },
  
  jsonResponse: function(errormsg, data) {
		
		let response = new Object();
		
		if(errormsg) {
			response.errormsg = errormsg;
			sails.config.log.addlog(undefined, "ERROR", errormsg);
		}
		
		if(data)
			response.data = data;
		
		return response;
	}
  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // sendgridSecret: 'SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …

};
