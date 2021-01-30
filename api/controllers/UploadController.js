/**
 * UploadController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	
	getupload: async function(req, res)	 {
		sails.config.log.addINlog(req.user.email, req.options.action);
		res.view('upload');
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},

	postupload: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		sails.config.custom.getdumppath('uploadeddbf', function(err, path) {
			if(!err) {
				sails.config.log.addlog(4, memberid, req.options.action, 'waterfall starts');
				sails.config.globals.async.waterfall([
					function(cb) {
						req.file('upload_files').upload({dirname: path}, function(err, uploadedFiles){
							if(err) {
								sails.config.log.addlog(0, memberid, req.options.action, 'error 1');
								cb(err, null);
							} else {
								sails.config.log.addlog(4, memberid, req.options.action, 'waterfall 1 exit');
								cb(null, uploadedFiles);
							}
						});	
					},
					function(uploadedFiles, cb) {
						let fs = require('fs');
						let uploaded_files = [];
						sails.config.log.addlog(4, memberid, req.options.action, 'each starts');
						sails.config.globals.async.each(uploadedFiles, function(eachFile, cb_each) {
							let final_file_path = require('path').resolve(sails.config.appPath, path + Date.now() + eachFile.filename);	//	Requiring Date.now() to make the filename unique
							fs.rename(eachFile.fd, final_file_path, function(err){
								if(!err) {
									uploaded_files.push(final_file_path);
									cb_each();
									sails.config.log.addlog(4, memberid, req.options.action, 'each cb exit');
								}
								else {
									console.log(err);
									cb_each(err);
									sails.config.log.addlog(0, memberid, req.options.action, 'error 2');
								}
							});
						}/* end of each */, function(err) {
							if(err) {
								console.log(err);
								sails.config.log.addlog(0, memberid, req.options.action, 'error 3');
							}
							cb(err ? err : null, err ? null : uploaded_files);
							sails.config.log.addlog(4, memberid, req.options.action, 'each ends');
						});
					}
				], async function(err, uploaded_files){
					await sails.helpers.updateFromDbf.with({uploaded_files: uploaded_files, creator: req.user.name});
					if(err) {
						console.log(err);
						sails.config.log.addlog(0, memberid, req.options.action, err);
					}
					err ? res.redirect('/') : res.view('upload');
					sails.config.log.addOUTlog(req.user.email, req.options.action);
				});
			}
			else {
				console.log(err);
				sails.config.log.addlog(0, memberid, req.options.action, err);
				res.redirect('/');
				sails.config.log.addOUTlog(req.user.email, req.options.action);
			}
		});
	}
}
