module.exports = {


	friendlyName: 'Update from xls',


	description: '',


	inputs: {
		uploaded_files: {type: 'json'}
	},


	exits: {

	},


	fn: async function (inputs, exits) {
		
		console.log(inputs.uploaded_files);
		let xlsx = require('node-xlsx');
		
		sails.config.globals.async.eachSeries(inputs.uploaded_files, function(each_file, cb){
			console.log('working for ' + each_file);
			let usecase_index = -1;
			if(_.endsWith(each_file.toLowerCase(), 'account.xls')) {
				usecase_index = 0;
			} else if(_.endsWith(each_file.toLowerCase(), 'branch.xls')) {
				usecase_index = 1;
			} else if(_.endsWith(each_file.toLowerCase(), 'holihome.xls')) {
				usecase_index = 2;
			} else if(_.endsWith(each_file.toLowerCase(), 'member.xls')) {
				usecase_index = 3;
			} else if(_.endsWith(each_file.toLowerCase(), 'openbal.xls')) {
				usecase_index = 4;
			} else if(_.endsWith(each_file.toLowerCase(), 'tran.xls')) {
				usecase_index = 5;
			}
			
			if(usecase_index == -1) {
				//	Unwanted file is encountered
				console.log('unwanted file is encountered');
				cb();
			} else {
				const workSheetsFromFile = xlsx.parse(each_file);
				if(workSheetsFromFile && workSheetsFromFile.length > 0) {
					
					let data = workSheetsFromFile[0].data;	//	holds array of rows with index
					
					sails.config.globals.async.eachSeries(data, async function(each_data, callback){
						switch(usecase_index) {
							case 0: {	//	Account
								
								let accountid = Number(each_data[0]);
								if(_.isNaN(accountid)) {
									//	Skip it, do nothing here
								} else {
									let account = await Account.findOne({account_id: accountid});
									if(!account) {
										await Account.create({account_id: accountid, account_name: each_data[1], drcr: each_data[2]}).catch((err) => console.log(each_file + " - " + accountid));
									}
								}
								
								break;
							}
							case 1: {	//	branch
								let branchid = Number(each_data[0]);
								if(_.isNaN(branchid)) {
									//	Skip it, do nothing here
								} else {
									let branch = await Branch.findOne({branchid: branchid});
									if(!branch) {
										await Branch.create({
											branchid: branchid,
											branchaddr1: each_data[1],
											branchaddr2: each_data[2],
											branchaddr3: each_data[3],
											branchpin: each_data[4],
										}).catch((err) => console.log(each_file + " - " + branchid));
									}
								}
								break;
							}
							case 2: {	//	holihome
								let holidayid = Number(each_data[0]);
								if(_.isNaN(holidayid)) {
									//	Skip it, do nothing here
								} else {
								let holiday = await HolidayHome.findOne({holidayid: holidayid});
									if(!holiday) {
										await HolidayHome.create({
											holidayid: each_data[0],
											holidayname: each_data[1],
											holidayaddr1: each_data[2],
											holidayaddr2: each_data[3],
											holidayaddr3: each_data[4],
											holidayaddr4: each_data[5],
											holidaypin: each_data[6],
											contact: each_data[7],
										}).catch((err) => console.log(each_file + " - " + holidayid));
									}
								}
								break;
							}
							case 3: {	//	member
								let memberid = Number(each_data[0]);
								if(_.isNaN(memberid)) {
									//	Skip it, do nothing here
								} else {
									let member = await Member.findOne({memberid: memberid});
									if(!member) {
										await Member.create({
											memberid: memberid,
											membershipno: each_data[1],
											membername: each_data[2],
											pfindex: each_data[3],
											phone: each_data[4],
											email_id: each_data[5],
											nominee: each_data[6],
											kycdone: each_data[7] === 'Y',
											ressaddr1: each_data[8],
											ressaddr2: each_data[9],
											ressaddr3: each_data[10],
											resspin: each_data[11],
											birthdate: sails.config.custom.getTimestamp(each_data[12]),
											joindate: sails.config.custom.getTimestamp(each_data[13]),
											bankacc: each_data[14],
											branch_id: each_data[15],
											designation: each_data[15],
											status: each_data[16],
										}).catch((err) => {console.log(err);console.log(each_file + " - " + memberid)});;
									}
								}
								break;
							}
							case 4: {	//	openbal
								
								
								let memberid = Number(each_data[0]);
								if(_.isNaN(memberid)) {
									//	Skip it, do nothing here
								} else {
									var date = new Date(sails.config.custom.getTimestamp(each_data[1]));
									
									await OpeningBalance.create({
										memberid: memberid,
										year: (date.getMonth() < 3) ? date.getFullYear() - 1 : date.getFullYear(),
										account_id: each_data[2],
										balance: each_data[3],
									}).catch((err) => console.log(each_file + " - " + memberid));
								}
								break;
							}
							case 5: {	//	tran
								
								let voucherno = Number(each_data[0]);
								if(_.isNaN(voucherno)) {
									//	Skip it, do nothing here
								} else {
									await Transaction.create({
										voucherno: voucherno,
										postdate: sails.config.custom.getTimestamp(each_data[1]),
										valuedate: sails.config.custom.getTimestamp(each_data[2]),
										desc: each_data[3],
										memberid: each_data[4],
										account_id: each_data[5],
										amount: each_data[6],
										drcr: each_data[7]
									});
								}
								break;
							}
							default: break;	//	skip
						}
						callback();	//	Inner Each
					}, function(err){
						cb();		//	Outer Each
					});
				} else {
					console.log('Probably file contains no data');
				}
			}
		}, function(err) {	//Each final callback
			// All done.
			console.log('------------- done');
			return exits.success({});
		});
	}
};

