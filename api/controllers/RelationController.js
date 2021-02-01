/**
 * relationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	
	relationlist: async function(req, res) {
		/*let relationlist = await Members.find({});*/
		let list = []
		sails.config.log.addINlog(req.user.email, req.options.action);
		let id = req.param('id', undefined);
		let selfdetail = await Members.find({id : id});
		let name = selfdetail[0].first_Name +' '+selfdetail[0].last_Name
		let selfcreated = await Relations.find({self_id : id});
		let relativecreated = await Relations.find({relative_id : id})
		for(let i=0; selfcreated.length > i; i++){
			let data = {}
			let temp = await Members.find({id : selfcreated[i].relative_id});
				data.relative = temp[0].first_Name + ' ' +temp[0].middle_Name+ ' '+temp[0].last_Name
				data.id = 	temp[0].id;
				data.relationship = selfcreated[i].relationship;
				list.push(data);
		}
		for(let i=0; relativecreated.length > i; i++){
			let data = {}	
			let temp = await Members.find({id : relativecreated[i].self_id});
				data.relative = temp[0].first_Name + ' ' +temp[0].middle_Name+ ' '+temp[0].last_Name
				data.id = 	temp[0].id;
				data.relationship = relativecreated[i].relationship;
				list.push(data);
		}
		// selfcreated.map(async relation => { 
		// 		let temp = await Members.find({id : relation.relative_id});
		// 		data.name = temp[0].first_Name + ' ' +temp[0].middle_Name+ ' '+temp[0].last_Name
		// 		data.id = 	temp[0].id;
		// 		data.relationship = relation.relationship;
		// 		list.push(data);
		// 		return list;
		// 	}); 
		// relativecreated.forEach(async relation =>{
		// 	let temp = await Members.find({id : relation.self_id});
		// 		data.name = temp[0].first_Name + ' ' +temp[0].middle_Name+ ' '+temp[0].last_Name
		// 		data.id = 	temp[0].id;
		// 		data.relationship = relation.relationship;
		// 		list.push(data);
		// 		return list;
		// })	

		console.log(list);
		res.view('relationlist', {relationlist : list, name : name });
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
}
