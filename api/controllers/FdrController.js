/**
 * FdrController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	
	fdrdetails: async function(req, res) {
		let memberid = Number(req.body.memberid);
		sails.config.log.addINlog(req.memberid, req.options.action);
		if(memberid && (typeof memberid === 'number')) {
			let fdrs = await Fdr.find({memberid: memberid})
			res.send(sails.config.custom.jsonResponse(null, fdrs));
			sails.config.log.addlog(3, memberid, req.options.action, 'sending FDRs');
		} else {
			sails.config.log.addlog(0, memberid, req.options.action, 'Memberid is required as number, received as = ' + memberid);
			res.send(sails.config.custom.jsonResponse('Memberid is required as number', null));
		}
		sails.config.log.addOUTlog(memberid, req.options.action);
	}
};
