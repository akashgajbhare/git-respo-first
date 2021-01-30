var Parser = require('dbf-parser');
var hash = require('hash.js')
const sleep = (ms) => {return new Promise(resolve => setTimeout(resolve, ms));}

var Queue = require('better-queue');
var filejob_queue = new Queue(async function (each_file, cb) {
	//console.log('working for ' + each_file);
	sails.config.log.addINlog('helper', 'update-from-dbf-queue');
	sails.config.log.addlog(3, 'helper', 'update-from-dbf-queue', 'each file = ' + each_file);
	
	let sleep_time = 1;
	let usecase_index = -1;
	if(_.endsWith(each_file.toLowerCase(), 'account.dbf')) {
		usecase_index = 0;
	} else if(_.endsWith(each_file.toLowerCase(), 'branch.dbf')) {
		usecase_index = 1;
	} else if(_.endsWith(each_file.toLowerCase(), 'holihome.dbf')) {
		await HolidayHome.destroy({});	//	removing all the HolidayHomes and showing the new ones that gets uploaded.
		usecase_index = 2;
	} else if(_.endsWith(each_file.toLowerCase(), 'member.dbf')) {
		usecase_index = 3;
	} else if(_.endsWith(each_file.toLowerCase(), 'openbal.dbf')) {
		usecase_index = 4;
	} else if(_.endsWith(each_file.toLowerCase(), 'tran.dbf')) {
		usecase_index = 5;
	} else if(_.endsWith(each_file.toLowerCase(), 'loan.dbf')) {
		usecase_index = 6;
	} else if(_.endsWith(each_file.toLowerCase(), 'fdr.dbf')) {
		usecase_index = 7;
	} 

	if(usecase_index == -1) {
		//	Unwanted file is encountered
		console.log('unwanted file is encountered');
		sails.config.log.addlog(1, 'helper', 'update-from-dbf-queue', 'unwanted file is encountered');
		cb('unwanted file is encountered', null);
	} else {
		var parser = new Parser(each_file);

		let starttime = Date.now();

		parser.on('start', function(p) {
			console.log('dBase file parsing has started');
			sails.config.log.addlog(3, 'helper', 'update-from-dbf-queue', 'dbase file parsing has started');
		});

		parser.on('header', function(h) {
			console.log('dBase file header has been parsed');
			sails.config.log.addlog(3, 'helper', 'update-from-dbf-queue', 'dbase file header has been parsed');
		});

		parser.on('record', async function(record, done) {
			//console.log(record);
			switch(usecase_index) {
				case 0: {	//	Account

					let accountid = record.ACCOUNT_ID
					if(_.isNaN(accountid)) {
						//	Skip it, do nothing here
					} else {
						let account = await Account.findOne({account_id: accountid});
						if(!account) {
							await Account.create({
								account_id: accountid, 
								account_name: record.ACCT_NAME, 
								drcr: record.DRCR
							}).catch((err) => console.log(each_file + " - " + accountid));
						} else {
							await Account.updateOne({
								id: account.id,
							}).set({
								account_id: accountid, 
								account_name: record.ACCT_NAME, 
								drcr: record.DRCR
							}).catch((err) => console.log(each_file + " during update - " + accountid));
						}
					}

					break;
				}
				case 1: {	//	branch
					let branchid = record.BRANCHID;
					if(_.isNaN(branchid)) {
						//	Skip it, do nothing here
					} else {
						let branch = await Branch.findOne({branchid: branchid});
						if(!branch) {
							await Branch.create({
								branchid: branchid,
								branchname: record.BRCHNAME,
								branchaddr1: record.BRCHADDR1,
								branchaddr2: record.BRCHADDR2,
								branchaddr3: record.BRCHADDR3,
								branchpin: record.BRCHPIN,
							}).catch((err) => console.log(each_file + " - " + branchid));
						} else {
							await Branch.updateOne({
								id: branch.id,
							}).set({
								branchid: branchid,
								branchname: record.BRCHNAME,
								branchaddr1: record.BRCHADDR1,
								branchaddr2: record.BRCHADDR2,
								branchaddr3: record.BRCHADDR3,
								branchpin: record.BRCHPIN,
							}).catch((err) => console.log(each_file + " during update - " + branchid));
						}
					}
					break;
				}
				case 2: {	//	holihome
					let holidayid = record.HH_ID;
					if(_.isNaN(holidayid)) {
						//	Skip it, do nothing here
					} else {
					let holiday = await HolidayHome.findOne({holidayid: holidayid});
						if(!holiday) {
							await HolidayHome.create({
								holidayid: record.HH_ID,
								holidayname: record.HH_NAME,
								holidayaddr1: record.HH_ADDR1,
								holidayaddr2: record.HH_ADDR2,
								holidayaddr3: record.HH_ADDR3,
								holidayaddr4: record.HH_ADDR4,
								holidaypin: record.HH_PIN,
								contact: record.CONTACT,
							}).catch((err) => console.log(each_file + " - " + holidayid));
						} else {
							await HolidayHome.updateOne({
								id: holiday.id
							}).set({
								holidayid: record.HH_ID,
								holidayname: record.HH_NAME,
								holidayaddr1: record.HH_ADDR1,
								holidayaddr2: record.HH_ADDR2,
								holidayaddr3: record.HH_ADDR3,
								holidayaddr4: record.HH_ADDR4,
								holidaypin: record.HH_PIN,
								contact: record.CONTACT,
							}).catch((err) => console.log(each_file + " during update - " + holidayid));
						}
					}
					break;
				}
				case 3: {	//	member
					let memberid = record.MEMBERID;
					if(_.isNaN(memberid)) {
						//	Skip it, do nothing here
						sleep_time = 10000;
					} else {
						let member = await Member.findOne({memberid: memberid});
						if(!member) {
							await Member.create({
								memberid: memberid,
								membershipno: record.MEMBERNO,
								membername: record.MEMBERNAME,
								pfindex: record.PFINDEX,
								phone: record.CONTACT ? hash.sha256().update(record.CONTACT).digest('hex') : memberid,
								email_id: record.EMAILID,
								nominee: record.NOMINEE,
								kycdone: record.KYCDONE === 'Y',
								ressaddr1: record.RESADDR1,
								ressaddr2: record.RESADDR2,
								ressaddr3: record.RESADDR3,
								resspin: record.RESPIN,
								birthdate: sails.config.custom.getTimestamp(record.BIRTHDATE),
								joindate: sails.config.custom.getTimestamp(record.JOINDATE),
								bankacc: record.BANKACC,
								branch_id: record.BRANCHID,
								designation: record.DESIG,
								status: record.STATUS,
							}).catch((err) => {console.log(err);console.log(each_file + " - " + memberid);sleep_time=10000;});;
						} else {
							await Member.updateOne({
								id: member.id
							}).set({
								memberid: memberid,
								membershipno: record.MEMBERNO,
								membername: record.MEMBERNAME,
								pfindex: record.PFINDEX,
								phone: record.CONTACT ? hash.sha256().update(record.CONTACT).digest('hex') : memberid,
								email_id: record.EMAILID,
								nominee: record.NOMINEE,
								kycdone: record.KYCDONE === 'Y',
								ressaddr1: record.RESADDR1,
								ressaddr2: record.RESADDR2,
								ressaddr3: record.RESADDR3,
								resspin: record.RESPIN,
								birthdate: sails.config.custom.getTimestamp(record.BIRTHDATE),
								joindate: sails.config.custom.getTimestamp(record.JOINDATE),
								bankacc: record.BANKACC,
								branch_id: record.BRANCHID,
								designation: record.DESIG,
								status: record.STATUS,
							}).catch((err) => {console.log(err);console.log(each_file + " during update - " + memberid);sleep_time=10000});;
						}
					}
					break;
				}
				case 4: {	//	openbal


					let memberid = Number(record.MEMBERID);
					if(_.isNaN(memberid)) {
						//	Skip it, do nothing here
					} else {
						var date = new Date(sails.config.custom.getTimestamp(record.OPENDATE));

						let openingbalance = await OpeningBalance.findOne({
							memberid: memberid,
							year: (date.getMonth() < 3) ? date.getFullYear() - 1 : date.getFullYear(),
							account_id: record.ACCOUNT_ID
						});

						if(!openingbalance) {
							await OpeningBalance.create({
								memberid: memberid,
								year: (date.getMonth() < 3) ? date.getFullYear() - 1 : date.getFullYear(),
								account_id: record.ACCOUNT_ID,
								balance: record.BALANCE,
							}).catch((err) => console.log(each_file + " - " + memberid));
						} else {
							await OpeningBalance.updateOne({
								id: openingbalance.id
							}).set({
								memberid: memberid,
								year: (date.getMonth() < 3) ? date.getFullYear() - 1 : date.getFullYear(),
								account_id: record.ACCOUNT_ID,
								balance: record.BALANCE,
							}).catch((err) => console.log(each_file + " during update - " + memberid));
						}
					}
					break;
				}
				case 5: {	//	tran

					let voucherno = record.VOUCHER;
					if(_.isNaN(voucherno)) {
						//	Skip it, do nothing here
					} else {
						//await Transaction.destroy({voucherno: voucherno});
						let voucherid = '' + record.ACCOUNT_ID + '-' + record.MEMBERID + '-' + record.VOUCHER + record.DRCR;
						let transaction = await Transaction.findOne({voucherno: voucherid});
						if(!transaction) {
							await Transaction.create({
								voucherno: voucherid,
								postdate: sails.config.custom.getTimestamp(record.POSTDATE),
								valuedate: sails.config.custom.getTimestamp(record.VALUEDATE),
								desc: record.DESC,
								memberid: record.MEMBERID,
								account_id: record.ACCOUNT_ID,
								amount: record.AMOUNT,
								drcr: record.DRCR
							});
						} else {
							await Transaction.updateOne({voucherno: voucherid}).set({
								voucherno: voucherid,
								postdate: sails.config.custom.getTimestamp(record.POSTDATE),
								valuedate: sails.config.custom.getTimestamp(record.VALUEDATE),
								desc: record.DESC,
								memberid: record.MEMBERID,
								account_id: record.ACCOUNT_ID,
								amount: record.AMOUNT,
								drcr: record.DRCR
							});
						}
					}
					break;
				}
				case 6: {	//	Loan

					let memberid = record.MEMBERID;
					if(_.isNaN(memberid)) {
						//	Skip it, do nothing here
					} else {
						

						let surety = [];
						if(record.SURETY1 && record.SURETY1 != 0) surety.push(record.SURETY1);
						if(record.SURETY2 && record.SURETY2 != 0) surety.push(record.SURETY2);
						if(record.SURETY3 && record.SURETY3 != 0) surety.push(record.SURETY3);
						if(record.SURETY4 && record.SURETY4 != 0) surety.push(record.SURETY4);

						let loan = await Loan.findOne({memberid: memberid});
						if(!loan) {
							await Loan.create({
								memberid: memberid,
								loandate: sails.config.custom.getTimestamp(record.LOANDATE),
								grossloan: record.GROSSLOAN,
								netloan: record.NETLOAN,
								loanemi: record.LOANEMI,
								surety: surety,
								reason: record.REASON
							}).catch((err) => console.log(each_file + " - " + memberid));;
						} else {
							await Loan.updateOne({memberid: memberid}).set({
								//memberid: memberid,
								loandate: sails.config.custom.getTimestamp(record.LOANDATE),
								grossloan: record.GROSSLOAN,
								netloan: record.NETLOAN,
								loanemi: record.LOANEMI,
								surety: surety,
								reason: record.REASON
							}).catch((err) => console.log(each_file + " during update - " + memberid));
						}
					}
					break;
				}
				case 7: {	//	FDR
					let memberid = record.MEMBERID;
					let tdrno = record.TDRNO;
					if(_.isNaN(memberid) || _.isNaN(tdrno)) {
						//	Skip it, do nothing here
					} else {
						let fdr = await Fdr.findOne({tdrno: tdrno});
						if(!fdr) {
							await Fdr.create({
								memberid: memberid,
								tdrno: record.TDRNO,
								date: sails.config.custom.getTimestamp(record.FDDT),
								amount: record.AMOUNT,
								period: record.PERIOD,
								interestrate: record.INT
							});
						} else {
							await Fdr.updateOne({tdrno: record.TDRNO}).set({
								memberid: memberid,
								tdrno: record.TDRNO,
								date: sails.config.custom.getTimestamp(record.FDDT),
								amount: record.AMOUNT,
								period: record.PERIOD,
								interestrate: record.INT
							});
						}
					}
					break;
				}
				default: break;	//	skip
			}

			sleep(sleep_time).then(()=>done());
		});

		parser.on('end', function(p) {
			console.log('Finished parsing the dBase file');
			sails.config.log.addlog(3, 'helper', 'update-from-dbf-queue', 'Finisged parsing the dbase file');
			cb(null, true);
		});

		sails.config.log.addlog(3, 'helper', 'update-from-dbf-queue', 'starting to parse ' + each_file);
		parser.parse();
	}
});

module.exports = {


	friendlyName: 'Upload from dbf',


	description: '',


	inputs: {
		creator: {type: 'string', defaultsTo: "Unknown"},
		checkertaskid: {type: 'string', defaultsTo: undefined},
		uploaded_files: {type: 'json'},
		execute: {type: 'boolean', defaultsTo: false}
	},


	exits: {

	},


	fn: async function (inputs, exits) {
		
		//console.log(inputs);
		sails.config.log.addINlog('helper', 'update-from-dbf');
		sails.config.log.addlog(3, 'helper', 'update-from-dbf', 'execute = ' + inputs.execute);
		sails.config.globals.async.eachSeries(inputs.uploaded_files, async function(each_file, cb){
			if(inputs.execute) {
				//	Add it in queue
				filejob_queue.push(each_file, async function(err, result) {
					await Checker.updateOne({id: inputs.checkertaskid}).set({completed_on: Date.now(), job_status: (err ? err : 'completed') });
				});
			} else {
				//	Record it into db for the checker to take an action.
				await Checker.create({
					created_by: inputs.creator,
					approved_by: 'TODO',
					job_status: 'pending',
					job_type: 'fileupload',
					job_inputs: each_file,
				});
			}
			cb();
		}, function(err) {	//Each final callback
			// All done.
			//console.log('------------- done');
			sails.config.log.addINlog('helper', 'update-from-dbf');
			return exits.success({});
		});
	}
};

