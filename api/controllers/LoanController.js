/**
 * HolidayController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	
	loandetails: async function(req, res) {
		let response = {};
		let memberid = Number(req.body.memberid);
		sails.config.log.addINlog(memberid, req.options.action);
		if(memberid && (typeof memberid === 'number')) {
			let loan = await Loan.findOne({memberid: memberid});	//	My Loan record
			response.loan = loan;
			
			if(loan && loan.surety) {
				let surety_for_me = await Member.find({where: {memberid: {in: loan.surety}}, select: ['membername']});
				loan.surety_for_me = surety_for_me;
				
				let loans = await Loan.find({where: {surety: memberid}, select: ['memberid']});	//	Loan record of people for whom I am a surety
				if(loans && loans.length > 0) {
					let memberids = [];
					for(let i = 0; i < loans.length; i++)
						memberids.push(loans[i].memberid);
					let surety_by_me = await Member.find({where: {memberid: {in: memberids}}, select: ['membername']});
					loan.surety_by_me = surety_by_me;
				} else {
					console.log('i as surety for none');
				}
			}
			
			res.send(sails.config.custom.jsonResponse(null, loan));
		} else {
			sails.config.log.addlog(1, 'system', req.options.action, 'Memberid is required as number = ' + memberid);
			res.send(sails.config.custom.jsonResponse('Memberid is required as number', null));
		}
		
		sails.config.log.addOUTlog(memberid, req.options.action);
	}
};
