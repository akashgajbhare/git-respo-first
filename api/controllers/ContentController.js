/**
 * ContentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

	content: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		res.view('content');
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	getcontentfor: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		let select_content_to_edit = req.body.select_content_to_edit;
		sails.config.log.addlog(3, req.user.email, req.options.action, 'content requested for = ' + select_content_to_edit);
		
		if(select_content_to_edit) {
			let setting = await Setting.findOne({name: select_content_to_edit});
			res.json(sails.config.custom.jsonResponse(null, setting.value));
		} else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'There exists no content of this type = ' + select_content_to_edit);
			res.json(sails.config.custom.jsonResponse('There exists no content of this type', null));
		}
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	savecontentfor: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		let select_content_to_edit = req.body.select_content_to_edit;
		let content = JSON.parse(req.body.content);
		
		sails.config.log.addlog(3, req.user.email, req.options.action, 'save requested for = ' + select_content_to_edit);
		if(select_content_to_edit && content) {
			await Setting.updateOne({name: select_content_to_edit}).set({value: content})
			res.json(sails.config.custom.jsonResponse(null, true));
			
			var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
			let content_delta = new QuillDeltaToHtmlConverter(content.ops, {});
			let content_in_html = content_delta.convert();
			
			var fs = require("fs");
			fs.writeFile('./static_data/' + select_content_to_edit + '.html', content_in_html, (err) => {
				if (err) {
					console.log(err);
					sails.config.log.addlog(0, req.user.email, req.options.action, err);
				}
				else {
					sails.config.log.addlog(3, req.user.email, req.options.action, 'Successfully Written to File ' + select_content_to_edit);
					console.log("Successfully Written to File " + select_content_to_edit);
				}
			});
		} else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'There exists no content of this type = ' + select_content_to_edit);
			res.json(sails.config.custom.jsonResponse('There exists no content of this type', null));
		}
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	}

};

