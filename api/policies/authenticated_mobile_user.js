/**
 * allow any authenticated user
 */

module.exports = async function (req, res, ok) {
	
	let objectid = req.body.member;
	let memberid = req.body.memberid;
	
	console.log(1);
	if(objectid === undefined && memberid === undefined) {
		memberid = req.body.user_id;
		console.log(2);
	}
	
	let fcm_token = req.body.fcm;
	console.log(3);
	if(fcm_token === undefined) {
		fcm_token = req.body.token;
		console.log(4);
	}
	
	console.log(memberid + objectid + fcm_token);
	if((memberid || objectid) && fcm_token) {
		console.log(5);
		let member = await Member.findOne(memberid ? {memberid: memberid} : {id: objectid});
		console.log(6);
		console.log(member);
		if(member && (member.token === fcm_token)) {
			return ok();
		} else {
			sails.config.log.addlog(1, undefined, 'autheitcated_mobile_user', 'Your membership does not exist');
			return res.send(sails.config.custom.jsonResponse('Your membership does not exist !', null));
		}
	} 
	console.log(7);
	sails.config.log.addlog(1, undefined, 'autheitcated_mobile_user', 'Your membership does not exist');
	return res.send(sails.config.custom.jsonResponse('Please login into your mobile application and try !', null));
};