/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
	setTimeout(function()
	{
		let softlinknames = ['forms', 'uploadeddbf', 'static_data'];
		let shell = require('shelljs');
		
		for(let i = 0; i < softlinknames.length; i++) {
			shell.mkdir("-p", './' + softlinknames[i]);

			let lnk = require('lnk');
			lnk([softlinknames[i]], '.tmp/public').then(() => console.log(softlinknames[i] + ' created')).catch((err)=>console.log(err));
		}
	},2000);
	
	//	create all keys for settin_keys from custom
	
	//console.log(Object.keys(sails.config.custom.setting_keys));
	await sails.config.custom.createSettingKeys();
	
	//sails.config.custom.updateImportantTimeStamps();

};
