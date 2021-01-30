/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	
	gettransactionsformember: async function(req, res) {
		let memberid = Number(req.body.memberid);
		let accountid = Number(req.body.accountid);
		sails.config.log.addINlog(memberid, req.options.action);
		sails.config.log.addlog(4, memberid, req.options.action, 'accountid = ' + accountid);
		if( typeof memberid === 'number' && typeof accountid === 'number') {
			sails.config.log.addlog(4, memberid, req.options.action, 'finding this year transactions');
			let transactions = await Transaction.find({
				//where: [{voucherno: {startsWith: '' + req.body.accountid + '-' + req.body.memberid + sails.config.custom.fullYearOfThisFYApril}}]
				memberid: req.body.memberid,
				account_id: req.body.accountid,
				postdate: {
					'>=': sails.config.custom.timestampThisFYApril,
					'<': Date.now()
				},
			}).sort('postdate ASC');
			
			sails.config.log.addlog(4, memberid, req.options.action, 'finding last year transactions');
			let last_year_transactions = await Transaction.find({
				//where: [{voucherno: {startsWith: '' + req.body.accountid + '-' + req.body.memberid + sails.config.custom.fullYearOfLastFYApril}}]
				memberid: req.body.memberid,
				account_id: req.body.accountid,
				postdate: {
					'>=': sails.config.custom.timestampLastFYApril,
					'<': sails.config.custom.timestampThisFYApril
				}
			}).sort('postdate ASC');
			
			sails.config.log.addlog(4, memberid, req.options.action, 'calculating opening and closing balance for this year');
			let this_year_opening_balance = await OpeningBalance.findOne({memberid: req.body.memberid, account_id: req.body.accountid, year: sails.config.custom.fullYearOfThisFYApril});
			let this_year_closing_balance = this_year_opening_balance ? this_year_opening_balance.balance : 0; 
			for(let i = 0; i < transactions.length; i++) {
				switch(transactions[i].drcr.toLowerCase()) {
					case 'dr':
						this_year_closing_balance -= transactions[i].amount;
						break;
					case 'cr':
						this_year_closing_balance += transactions[i].amount;
						break;
					default:
						sails.config.log.addlog(0, memberid, req.options.action, 'error in calculating the opening balance for this year for accountid = ' + accountid);
						console.log('error in calculating the opening balance for this year');
						break;		
				}
			}
			
			sails.config.log.addlog(4, memberid, req.options.action, 'calculating opening and closing balance for last year');
			let last_year_opening_balance = await OpeningBalance.findOne({memberid: req.body.memberid, account_id: req.body.accountid, year: sails.config.custom.fullYearOfLastFYApril});
			let last_year_closing_balance = last_year_opening_balance ? last_year_opening_balance.balance : 0; 
			for(let j = 0; j < last_year_transactions.length; j++) {
				switch(last_year_transactions[j].drcr.toLowerCase()) {
					case 'dr':
						last_year_closing_balance -= last_year_transactions[j].amount;
						break;
					case 'cr':
						last_year_closing_balance += last_year_transactions[j].amount;
						break;
					default:
						sails.config.log.addlog(0, memberid, req.options.action, 'error in calculating the opening balance for last year for accountid = ' + accountid);
						console.log('error in calculating the opening balance for last year');
						break;		
				}
			}
			
			res.json(new sails.config.custom.jsonResponse(null, {
				this_year_transactions: transactions, 
				last_year_transactions: last_year_transactions,
				this_year_opening_balance: Math.abs(this_year_opening_balance ? this_year_opening_balance.balance : 0),
				last_year_opening_balance: Math.abs(last_year_opening_balance ? last_year_opening_balance.balance : 0),
				this_year_closing_balance: Math.abs(this_year_closing_balance),
				last_year_closing_balance: Math.abs(last_year_closing_balance),
			}));
		} else {
			res.json(new sails.config.custom.jsonResponse('memberid or accountid format is incorrect', null));
		}
		
		sails.config.log.addINlog(memberid, req.options.action);
	},
};

