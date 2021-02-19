/**
 * memberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	
	membereditget: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		let id = req.param('id', undefined);
		sails.config.log.addlog(3, req.user.email, req.options.action, 'id = ' + id);
		let member = await Members.findOne({id: id});
		res.view('membercreate', {member: member, requser: req.user});
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	membereditpost: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		let id = req.body.membercreate_id;
		let date = new Date(req.body.membercreate_dob);
		var milliseconds = date.getTime();
		console.log(milliseconds);
		sails.config.log.addlog(3, req.user.email, req.options.action, 'id = ' + id);
		var setvalues = {
				first_Name: req.body.membercreate_fname,
				middle_Name: req.body.membercreate_mname,
				last_Name: req.body.membercreate_lname,
				dob: milliseconds,
				phone : req.body.membercreate_phone,
				address: req.body.membercreate_address,
				pincode: req.body.membercreate_pincode,
				state: req.body.membercreate_state,
				city: req.body.membercreate_city,
			}
		
			
		if(id) {
			var member = await Members.updateOne({id: id}).set(setvalues);
			if(member)
				res.redirect('/memberlist');
			else
				res.redirect('/memberedit/' + id);
			
		} else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'There is nothing to edit for id = ' + id);
			res.json(sails.config.custom.jsonResponse('There is nothing to edit', null));
		}
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	memberlist: async function(req, res) {
		/*let memberlist = await Members.find({});*/
		sails.config.log.addINlog(req.user.email, req.options.action);
		let memberlist = await Members.find();
		res.view('memberlist', {memberlist: memberlist});
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},

	getmembercreate: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		res.view('membercreate', {requser: req.user});
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	membercreate: async function(req, res) {
		//	TODO Validate the input and proceed
		let rules;
		let date = new Date(req.body.membercreate_dob);
		var milliseconds = date.getTime();
		console.log(milliseconds);
		sails.config.log.addINlog(req.user.email, req.options.action);
        if(req.body.membercreate_phone){
            rules = [{ tagid: "mobileno", text: req.body.membercreate_phone, regex_name: 'text', errmsg: 'Please enter the valid mobile No', allow_numbers: true, max: 10, min: 10, required: true }];
        }
        else
        { 
            return res.view('membercreate',sails.config.custom.jsonResponse("Your mobile no. is not getting", null))
        }
        let isValideNumber = await sails.helpers.validation(rules);
        if (isValideNumber.errmsg) {
            res.json(sails.config.custom.jsonResponse(isValideNumber.errmsg, null))
        } else {
			let checkNoData = await Members.count({phone :  req.body.membercreate_phone });
			if(checkNoData === 0 ){
				var createdmember = await Members.create({
					first_Name: req.body.membercreate_fname,
					middle_Name: req.body.membercreate_mname,
					last_Name: req.body.membercreate_lname,
					dob: milliseconds,
					phone : req.body.membercreate_phone,
					address: req.body.membercreate_address,
					pincode: req.body.membercreate_pincode,
					state: req.body.membercreate_state,
					city: req.body.membercreate_city,
				}).fetch()
				.catch((err)=>{  
					return res.view('membercreate', sails.config.custom.jsonResponse("Required data field is missing..", null));
				})
				res.redirect('/memberlist');
				sails.config.log.addOUTlog(req.user.email, req.options.action);
			}
			else
			{
				console.log(sails.config.custom.jsonResponse("Mobile no. already Register", null));
				return res.view('membercreate', sails.config.custom.jsonResponse("Mobile no. already Register", null));
			}
		}
	},
	
	memberactivestatus: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		sails.config.log.addlog(4, req.user.email, req.options.action, 'member = ' + req.body.memberid + ', enable = ' + req.body.set_member_status);
		var member = await Members.updateOne({id: req.body.memberid}).set({enabled: req.body.set_member_status});
		if(member)
			res.json(sails.config.custom.jsonResponse(null, member));
		else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'There is nothing to edit for id = ' + req.body.memberid);
			res.json(sails.config.custom.jsonResponse('Members does not exist', member));
		}
	
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	memberdelete: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		
		sails.config.log.addlog(4, req.user.email, req.options.action, 'member = ' + req.body.memberid);
		var destroyedmember = await Members.destroyOne({id:req.body.memberid});
		if(destroyedmember) {
			res.json(sails.config.custom.jsonResponse(null, {data: true}));
		} else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'Either the member does not exist or an internal error occured for id = ' + req.body.memberid);
			res.json(sails.config.custom.jsonResponse('Either the member does not exist or an internal error occured', null));
		}
		
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	/*getmemberbyphone: async function(req, res) {
		let phone = req.query.phone;
		if(phone) {
			let member = await Members.findOne({phone: phone}).populate('store').populate('reports_to');
			if(member)
				res.json(sails.config.custom.jsonResponse(null, member));
			else
				res.json(sails.config.custom.jsonResponse('The member does not exist', null));
		} else {
			res.json(sails.config.custom.jsonResponse('Need a valid Phone Number', null));
		}
	},*/
}
