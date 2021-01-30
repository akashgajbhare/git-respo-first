/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	
	/*formeditget: async function(req, res) {
		let id = req.param('id', undefined);
		let form = await Form.findOne({id: id}).populate('reports_to');
		res.view('formcreate', {form: form, requser: req.user});
	},*/
	
	formeditpost: async function(req, res) {
		let id = req.body.formcreate_id;
		var setvalues = {
				name: req.body.formcreate_name,
				email: req.body.formcreate_email,
				phone: req.body.formcreate_phone,
				role: req.body.formcreate_role,
				zone: req.body.formcreate_zone,
				branch: req.body.formcreate_branch,
				reports_to: (req.body.formcreate_reports_to && req.body.formcreate_reports_to.length > 0) ? req.body.formcreate_reports_to : null,
			}
		
		if(req.body.formcreate_password) {
			setvalues.password = req.body.formcreate_password;
		}
		
		if(id) {
			var form = await Form.updateOne({id: id}).set(setvalues);
			if(form)
				res.redirect('/formlist');
			else
				res.redirect('/formedit/' + id);
			
		} else {
			res.json(sails.config.custom.jsonResponse('There is nothing to edit', null));
		}
	},
	
	formlist: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		let formlist = await Form.find().sort('createdAt DESC');
		res.view('formlist', {formlist: formlist});
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	getformcreate: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		res.view('formcreate', {requser: req.user});
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	formcreate: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		sails.config.custom.getdumppath('forms', function(err, path) {
			sails.config.log.addlog(2, req.user.email, req.options.action, 'path = ' + path);
			if(!err) {
				sails.config.log.addlog(4, req.user.email, req.options.action, 'waterfall starts');
				sails.config.globals.async.waterfall([
					function(cb) {
						req.file('upload_form').upload({dirname: path}, function(err, uploadedFiles){
							sails.config.log.addlog(4, req.user.email, req.options.action, 'uploadedfiles = ' + uploadedFiles);
							
							if(err) {
								sails.config.log.addlog(0, req.user.email, req.options.action, 'error 1');
								console.log(err);
								cb(err, null);
							} else {
								cb(null, uploadedFiles);
							}
						});	
					},
					function(uploadedFiles, cb) {
						let fs = require('fs');
						let uploaded_files = [];
						
						sails.config.log.addlog(4, req.user.email, req.options.action, 'async each starts');
						sails.config.globals.async.each(uploadedFiles, function(eachFile, cb_each) {
							let extention = eachFile.filename.slice(eachFile.filename.lastIndexOf('.'));
							let final_file_path = path + new Date().getTime() + (extention ? extention : '');
							//require('path').resolve(sails.config.appPath, path + eachFile.filename);
							sails.config.log.addlog(4, req.user.email, req.options.action, 'renaming files from ' + eachFile.fd + ' , to ' + final_file_path);
							fs.rename(eachFile.fd, final_file_path, function(err){
								if(!err) {
									uploaded_files.push(final_file_path);
									cb_each();
								}
								else {
									sails.config.log.addlog(0, req.user.email, req.options.action, 'error 2');
									console.log(err);
									cb_each(err);
								}
							});
						}/* end of each */, function(err) {
							if(err) {
								sails.config.log.addlog(0, req.user.email, req.options.action, 'error 3');
								console.log(err);
							}
							cb(err ? err : null, err ? null : uploaded_files);
						});
					}
				], async function(err, uploaded_files){
					await Form.create({
						title: req.body.formcreate_title,
						path: uploaded_files[0].slice(1)	//	To Remove the dot from initial
					});
					
					if(err) {
						sails.config.log.addlog(0, req.user.email, req.options.action, 'error 4');
						console.log(err);
					}
					
					res.redirect('/formlist');
					sails.config.log.addOUTlog(req.user.email, req.options.action);
				});
			}
			else {
				sails.config.log.addlog(0, req.user.email, req.options.action, err);
				res.redirect('/formlist');
				sails.config.log.addOUTlog(req.user.email, req.options.action);
			}
		});
	},
	
	formactivestatus: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		
		sails.config.log.addlog(2, req.user.email, req.options.action, 'enable = ' + req.body.set_form_status + ', id = ' + req.body.formid);
		
		var form = await Form.updateOne({id: req.body.formid}).set({enabled: req.body.set_form_status});
		if(form)
			res.json(sails.config.custom.jsonResponse(null, form));
		else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'Form does not exist');
			res.json(sails.config.custom.jsonResponse('Form does not exist', form));
		}
		
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	formdelete: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		sails.config.log.addlog(3, req.user.email, req.options.action, 'Destroying form = ' + req.body.formid);
		
		var destroyedForm = await Form.destroyOne({id:req.body.formid});
		if(destroyedForm) {
			res.json(sails.config.custom.jsonResponse(null, {data: true}));
		} else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'Either the form does not exist or an internal error occured');
			res.json(sails.config.custom.jsonResponse('Either the form does not exist or an internal error occured', null));
		}
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	getforms: async function(req, res) {
		let formlist = await Form.find({enabled: true}).sort('createdAt DESC');
		res.json(sails.config.custom.jsonResponse(null, formlist));
	}
};

