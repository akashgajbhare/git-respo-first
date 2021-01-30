/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	
	pendingcheckertasks: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		let checkertasks = await Checker.find({job_status: {'in': ['working', 'pending']}});
		res.view('pendingcheckertasks', {checkertasks: checkertasks, role: req.user.role});
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	approvecheckertask: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		if(req.body.checkertaskid) {
			let approve = JSON.parse(req.body.approve);
			let checkertask = await Checker.updateOne({id: req.body.checkertaskid}).set({approved_by: req.user.name, approved_on: Date.now(), job_status: approve ? 'working' : 'declined' , reason: req.body.reason});
			
			sails.config.log.addlog(3, req.user.email, req.options.action, 'checkertask = ' + req.body.checkertaskid + ', approve = ' + approve);
			
			if(checkertask && approve) {
				switch(checkertask.job_type) {
					case 'fileupload':
						sails.config.log.addlog(3, req.user.email, req.options.action, 'case: fileupload');
						await sails.helpers.updateFromDbf.with({uploaded_files: [checkertask.job_inputs], checkertaskid: checkertask.id, execute: true});
						break;
					default:
						sails.config.log.addlog(1, req.user.email, req.options.action, 'case: default');
				}
				
				res.json(sails.config.custom.jsonResponse(null, true));
			} else {
				res.json(sails.config.custom.jsonResponse(null, true));
			}
		} else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'The id of the task is missing');
			res.json(sails.config.custom.jsonResponse('The id of the task is missing', null));
		}
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	checkertasklist: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		res.view('checkertasklist');
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	fetchcheckertasklist: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		let checkertask_start_date = Number(req.body.start_date);
		let checkertask_end_date = Number(req.body.end_date);
		
		sails.config.log.addlog(3, req.user.email, req.options.action, 'start date = ' + checkertask_start_date + ', end date = ' + checkertask_end_date);
		if(typeof checkertask_start_date === 'number' && typeof checkertask_end_date === 'number') {
			let checkertasklist = await Checker.find({where: {
				and: [
					{createdAt: {'>': checkertask_start_date}},
					{createdAt: {'<': checkertask_end_date}}
				]
			}});
			sails.config.log.addlog(3, req.user.email, req.options.action, 'sending task list');
			res.json(sails.config.custom.jsonResponse(null, checkertasklist));
		} else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'The dates seems to be invalid');
			res.json(sails.config.custom.jsonResponse('The dates seems to be invalid', null));
		}
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	}
};

