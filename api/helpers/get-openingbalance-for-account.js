module.exports = {


	friendlyName: 'Get Opening Balance For Account',


	description: '',


	inputs: {
		item:		{type: 'json'},
		memberid:	{type: 'number'},
	},


	exits: {

	},


	fn: async function (inputs, exits) {
		sails.config.log.addINlog('helper', 'get-opening-balance-for-account');
		let account = await Account.findOne({account_id: inputs.item.account_id});
		
		if(account) {
			let sum = inputs.item.balance;
			let as_on_date = sails.config.custom.timestampLastFYApril;
			
			let transactions = await Transaction.find({
				where: {postdate: {'>=': sails.config.custom.timestampThisFYApril}, memberid: inputs.memberid, account_id: inputs.item.account_id},
				//where: [
				//	{
				//		voucherno: {
				//			startsWith: '' + inputs.item.account_id + '-' + inputs.memberid + '-' + sails.config.custom.fullYearOfThisFYApril
				//		}
				//	}
				//],
				//select: ['amount', 'drcr', 'postdate']
			});

			inputs.item.account_name = account.account_name;

			sails.config.log.addlog(4, 'helper', 'get-opening-balance-for-account', 'starting with eachSeries');
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
						sails.config.log.addlog(0, 'helper', 'get-opening-balance-for-account', 'error in calculating the opening balance');
						break;		
				}

				sails.config.log.addlog(4, 'helper', 'get-opening-balance-for-account', 'loop completed');
				t_callback();

			}, function(err) {
				inputs.item.balance = sum;
				inputs.item.as_on_date = as_on_date;
				sails.config.log.addlog(0, 'helper', 'get-opening-balance-for-account', err);
				sails.config.log.addOUTlog('helper', 'get-opening-balance-for-account');
				exits.success(inputs.item);
			});
		} else {
			sails.config.log.addOUTlog('helper', 'get-opening-balance-for-account');
			exits.success(inputs.item);
		}		
	}
};







