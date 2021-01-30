/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	
	usereditget: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		let id = req.param('id', undefined);
		sails.config.log.addlog(3, req.user.email, req.options.action, 'id = ' + id);
		let user = await User.findOne({id: id});
		res.view('usercreate', {user: user, requser: req.user});
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	usereditpost: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		let id = req.body.usercreate_id;
		sails.config.log.addlog(3, req.user.email, req.options.action, 'id = ' + id);
		var setvalues = {
				name: req.body.usercreate_name,
				email: req.body.usercreate_email,
				phone: req.body.usercreate_phone,
				role: req.body.usercreate_role,
			}
		
		if(req.body.usercreate_password) {
			setvalues.password = req.body.usercreate_password;
		}
		
		if(id) {
			var user = await User.updateOne({id: id}).set(setvalues);
			if(user)
				res.redirect('/userlist');
			else
				res.redirect('/useredit/' + id);
			
		} else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'There is nothing to edit for id = ' + id);
			res.json(sails.config.custom.jsonResponse('There is nothing to edit', null));
		}
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	userlist: async function(req, res) {
		/*let userlist = await User.find({});*/
		sails.config.log.addINlog(req.user.email, req.options.action);
		let userlist = await User.find({role: {'!=': sails.config.custom.roles[0]}});
		res.view('userlist', {userlist: userlist});
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	getusercreate: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		res.view('usercreate', {requser: req.user});
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	usercreate: async function(req, res) {
		//	TODO Validate the input and proceed
		
		sails.config.log.addINlog(req.user.email, req.options.action);
		var createdUser = await User.create({
			name: req.body.usercreate_name,
			email: req.body.usercreate_email,
			phone: req.body.usercreate_phone,
			password: req.body.usercreate_password,
			role: req.body.usercreate_role,
		}).fetch();
		
		res.redirect('/userlist');
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	useractivestatus: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		sails.config.log.addlog(4, req.user.email, req.options.action, 'user = ' + req.body.userid + ', enable = ' + req.body.set_user_status);
		var user = await User.updateOne({id: req.body.userid}).set({enabled: req.body.set_user_status});
		if(user)
			res.json(sails.config.custom.jsonResponse(null, user));
		else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'There is nothing to edit for id = ' + req.body.userid);
			res.json(sails.config.custom.jsonResponse('User does not exist', user));
		}
	
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	userdelete: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		
		sails.config.log.addlog(4, req.user.email, req.options.action, 'user = ' + req.body.userid);
		var destroyedUser = await User.destroyOne({id:req.body.userid});
		if(destroyedUser) {
			res.json(sails.config.custom.jsonResponse(null, {data: true}));
		} else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'Either the user does not exist or an internal error occured for id = ' + req.body.userid);
			res.json(sails.config.custom.jsonResponse('Either the user does not exist or an internal error occured', null));
		}
		
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	/*getuserbyphone: async function(req, res) {
		let phone = req.query.phone;
		if(phone) {
			let user = await User.findOne({phone: phone}).populate('store').populate('reports_to');
			if(user)
				res.json(sails.config.custom.jsonResponse(null, user));
			else
				res.json(sails.config.custom.jsonResponse('The user does not exist', null));
		} else {
			res.json(sails.config.custom.jsonResponse('Need a valid Phone Number', null));
		}
	},*/
}
