/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require('passport');

module.exports = {

	index: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		let count = await Member.count({where: {token: {'!=': ''}}});
		res.view('index', {mobile_user_count: count});
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	loginget: function(req, res) {
		sails.config.log.addINlog(undefined, req.options.action);
		if(req.user === undefined) {
			sails.config.log.addlog(3, undefined, req.options.action, 'Showing Login page');
			res.view('login');
		}
		else {
			sails.config.log.addlog(3, req.user.email, req.options.action, 'Redirecting to root');
			res.redirect('/');
		}
		sails.config.log.addOUTlog(undefined, req.options.action);
	},
	
	login: function(req, res) {

		passport.authenticate('local', function(err, user, info){
			if((err) || (!user)) {
				return res.view('login', {message: info.message});
			}

			req.logIn(user, function(err) {
				if(err) res.send(err);
				/*return res.send({
					message: info.message,
					user
				});*/
				res.redirect('/');
			});
		})(req, res);
	},

	logout: function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		req.logout();
		res.redirect('/login');
	},
	
	getregister: async function(req, res) {
		sails.config.log.addlog(3, undefined, req.options.action, 'attempting to register');
		var count = await User.count();
		if(count === 0)
			res.view('register');
		else
			res.redirect('/login');
	},
	
	register: async function(req, res) {
		sails.config.log.addlog(3, undefined, req.options.action, 'attempting to register');
		var count = await User.count();
	
		//	Only if there were no users, we should be allowing to register
		if(count === 0) {
			await User.create({
				name: req.body.register_name,
				email: req.body.register_email,
				phone: req.body.register_phone,
				password: req.body.register_password,
				role: 'admin',
				zone: 'All',
				branch: 'All'
			});
		}
		
		res.redirect('/login');
	},
	
	passwordresetreq: async function(req, res) {
		sails.config.log.addINlog(undefined, req.options.action);
		let email = req.body.reset_email;
		sails.config.log.addlog(3, undefined, req.options.action, 'password reset requested for ' + email);
		
		if(email) {
			let user = await User.findOne({email: email});
			if(user && user.enabled) {
				let md5 = require('md5');
				let ts = Date.now();
				let hash = md5(user.id + ts);
				await User.update({id: user.id}).set({resettime: ts});
				let url = sails.config.custom.base_url + '/resetpassword?hash=' + hash;
				//console.log(url);
				await sails.helpers.sendEmail.with({to: email, subject: 'Password Reset', body: 'Please click on the following link to reset your password. ' + url});
				res.view('resetpassword', {email: email});
				//res.send(sails.config.custom.jsonResponse(null, true));
			} else {
				res.json(sails.config.custom.jsonResponse('Email Id is not registered with us', null));
			}
		} else {
			res.json(sails.config.custom.jsonResponse('Input requires an email id', null));
		}
		
		sails.config.log.addOUTlog(undefined, req.options.action);
	},
	
	resetpassword: async function(req, res) {
		sails.config.log.addlog(3, undefined, req.options.action, 'Showing screen to reset the password');
		res.view('resetpassword', {hash: req.query.hash});
	},
	
	performresetpassword: async function(req, res) {
		let email = req.body.email;
		let password = req.body.password;
		let hash = req.body.hash;
		
		sails.config.log.addlog(3, undefined, req.options.action, 'attempting to reset password for ' + email);
		
		if(email && password && hash) {
			let user = await User.findOne({email: email});
			if(user && user.enabled && user.resettime > 0) {
				if(Date.now() - user.resettime < sails.config.custom.reset_password_timeout) {
					let md5 = require('md5');
					let md5_hash = md5(user.id + user.resettime);
					if(md5_hash === hash) {
						//	Set the new password and reset the ts to 0
						await User.update({id: user.id}).set({resettime: 0, password: password});
						res.json(sails.config.custom.jsonResponse(null, true));
						sails.config.log.addlog(3, undefined, req.options.action, "password is reset for " + email);
					} else {
						res.json(sails.config.custom.jsonResponse('Looks you are trying hard to crack it.', null));
						sails.config.log.addlog(1, undefined, req.options.action, "Looks you are trying hard to crack it. " + email);
					}
				} else {
					res.json(sails.config.custom.jsonResponse('Timeout ! Please request to reset the password again.', null));
					sails.config.log.addlog(3, undefined, req.options.action, "Timeout ! Please request to reset the password again. " + email);
				}
			} else {
				res.json(sails.config.custom.jsonResponse('Invalid user, please try again.', null));
				sails.config.log.addlog(1, undefined, req.options.action, "Invalid user, please try again. " + email);
			}
		} else {
			res.json(sails.config.custom.jsonResponse('Invalid input values, please try again.', null));
			sails.config.log.addlog(1, undefined, req.options.action, "Invalid input values, please try again.");
		}
	}
};

