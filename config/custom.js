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
  

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // mailgunDomain: 'transactional-mail.example.com',
  // mailgunSecret: 'key-testkeyb183848139913858e8abd9a3',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …
	
	reset_password_timeout: 1 * 60 * 60 * 1000,
	
	base_url: 'http://localhost:1337',	//	Do not keep / in the end
	
	setting_keys: {
		product_categories: 'product_categories',
		sample: 'sample',
		zones: 'zones',
		branches: 'branches',
		
		tnc: 'tnc',
		contact_us: 'contact_us',
		info: 'info',
		board_members: 'board_members'
	},
	
	roles: 			['admin',	'checker',	'maker'],
	apply_branch_filter: 	{
						admin:		false,
						checker: 	false,
						maker:		false,
	},
	
	upload_files: {
						admin:		true,
						checker: 	false,
						maker:		true,
	},
	
	allow_create_content: {
						admin:		true,
						checker: 	true,
						maker:		true,
	},
	
	allowed_to_approve_decline_uploaded_files: {
						admin:		true,
						checker: 	true,
						maker:		false,
	},
	
	holidayhomes_allowed_to_approve_decline: {
						admin:		true,
						checker: 	true,
						maker:		false,
	},
	
	user_create: 	{
						admin:		true,
						checker: 	false,
						maker:		true,
					},
	
	form_create: 	{
						admin:		true,
						checker: 	false,
						maker:		true,
					},
	
	member_create: 	{
						admin:		false,
						checker: 	false,
						maker:		false,
					},
	
	/********************** FOR MS PATEL *************************/
	
	
	serverKey: 'AAAACymi1oA:APA91bEmVoHKU9BILluPOYNB_E7bq9mIvntor_F9VRm7UAIAv0dtWX0EeGAyvNetCQZcOlAioYoVAjQzVGD902a4frQmzL_mkMiSmgZPyrNJcJhMJASqAWce_6F_yDM27OhAebhJPRFs', //put your server key here
	
	timestampLastFYApril: 0,
	timestampThisFYApril: 0,
	fullYearOfLastFYApril: 0,
	fullYearOfThisFYApril: 0,
	
	jsonResponse: function(errormsg, data) {
		
		let response = new Object();
		
		if(errormsg) {
			response.errormsg = errormsg;
			sails.config.log.addlog(undefined, "ERROR", errormsg);
		}
		
		if(data)
			response.data = data;
		
		return response;
	},
	
	getdumppath: function(purpose, fn) {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();

		var path = "./" + purpose + "/" + year + "/" + month + "/" + day + "/";
		var mkdirp = require('mkdirp');
    
		mkdirp(path, function (err) {
			fn(err, path);
		});
	},
	
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
	
	getReadableDate: function(timestamp, showTime = false, date_separator = '-', time_separator = ':') {
		
		let readable_date = 'NA';
		
		if(_.isNumber(timestamp)) {
			let date = new Date(timestamp);
			readable_date = sails.config.custom.normalizeDigitsToTwo(date.getDate()) + date_separator + sails.config.custom.normalizeDigitsToTwo(date.getMonth()+1) + date_separator + date.getFullYear();
			
			if(showTime) {
				readable_date += ', ' + sails.config.custom.normalizeDigitsToTwo(date.getHours()) + time_separator + sails.config.custom.normalizeDigitsToTwo(date.getMinutes());
			}
		}
		
		return readable_date;
	},
	
	getTimestamp: function(date) {	//	To be used only if date is of format 01-Apr-18 or 20190330
		let timestamp = 0;
		if(date) {
			let date_splits = date.split('-');
			if(date_splits.length === 3) {
				let currentYear = (new Date()).getFullYear();
				let shortYear = Number(date_splits[2]);
				if(shortYear > currentYear - 2000) {	//	which means short year belongs to 20th century
					date_splits[2] = '' + (1900 + shortYear);
				} else {
					date_splits[2] = '' + (2000 + shortYear);
				}
				
				timestamp = (new Date(_.kebabCase(date_splits))).getTime();
			} else if(date.length === 8) {
				timestamp = (new Date(_.kebabCase([date.slice(0,4), date.slice(4,6), date.slice(6)]))).getTime();
			}
		}
		
		return timestamp;
	},
	
	createSettingKeys: async function() {
		let setting_keys = Object.keys(sails.config.custom.setting_keys);
		for(let index = 0; index < setting_keys.length; index++) {
			//	Check if the setting exists or not. If it does not exist, then create.
			let setting = await Setting.findOne({name: setting_keys[index]});
			if(!setting)
				await Setting.create({name: setting_keys[index], value: []});
		}
	},

	updateImportantTimeStamps: function () {
		let date = new Date();
		let currentTimestamp = date.getTime();			

		//	Ensuring that while we are in JAN,FEB,MAR... the FY of previous to previous year gets covered
		if(date.getMonth() < 3)
			date.setYear(date.getFullYear()-1);

		date.setMonth(3);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		sails.config.custom.timestampThisFYApril = date.getTime();
		sails.config.custom.fullYearOfThisFYApril = date.getFullYear();

		date.setYear(date.getFullYear()-1);
		sails.config.custom.timestampLastFYApril = date.getTime();
		sails.config.custom.fullYearOfLastFYApril = date.getFullYear();
	}
};
