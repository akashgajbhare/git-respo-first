/**
 * OpeningBalanceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	
	getopeningbalanceformember: async function(req, res) {
		let memberid = Number(req.body.memberid);
		sails.config.log.addINlog(memberid, req.options.action);
		if( typeof memberid === 'number') {
			let openingBalance = await OpeningBalance.find({memberid: memberid, year: sails.config.custom.fullYearOfThisFYApril});
			let i = 0;
			sails.config.globals.async.each(openingBalance, async function(item, cb){
				let response = await sails.helpers.getOpeningbalanceForAccount.with({memberid: memberid, item: item});
				item.balance = Math.abs(response.balance);
				item.as_on_date = response.as_on_date;
				item.account_name = response.account_name;
				cb();
				/*let account = await Account.findOne({account_id: item.account_id});
				
				if(account) {
					let sum = item.balance;
					let as_on_date = sails.config.custom.timestampLastFYApril;
					
					let transactions = await Transaction.find({where: {postdate: {'>=': sails.config.custom.timestampThisFYApril}, memberid: memberid, account_id: item.account_id}, select: ['amount', 'drcr', 'postdate']});
					
					item.account_name = account.account_name;
					
					sails.config.globals.async.eachSeries(transactions, async function(transaction, t_callback){
						
						//	We want to use the latest date
						if(as_on_date < transaction.postdate)
							as_on_date = transaction.postdate;
						
						switch(transaction.drcr.toLowerCase()) {
							case 'dr':
								sum -= transaction.amount;
								break;
							case 'cr':
								sum += transaction.amount;
								break;
							default:
								console.log('error in calculating the opening balance');
								break;		
						}
						
						t_callback();
						
					}, function(err) {
						item.balance = sum;
						item.as_on_date = as_on_date;
						cb();	
					});
				} else {
					cb();
				}*/
			}, function(err) {
				if(err) {
					sails.config.log.addlog(0, 'system', req.options.action, err);
				}
				
				res.json(new sails.config.custom.jsonResponse(null, openingBalance));
				sails.config.log.addOUTlog(memberid, req.options.action);
			});
		} else {
			sails.config.log.addlog(1, 'system', req.options.action, 'memberid format is incorrect = ' + memberid);
			res.json(new sails.config.custom.jsonResponse('memberid format is incorrect', null));
			sails.config.log.addOUTlog(memberid, req.options.action);
		}
	},
};

