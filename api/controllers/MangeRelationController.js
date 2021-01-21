/**
 * MangeRelationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
    getRelation : async function (req , res){
        let getDetails = await Relations.find({relative_id : req.query.self_id})
        if(getDetails.length !== 0 ){
		    res.json(sails.config.custom.jsonResponse( null , getDetails));
        }else
        {
            res.json(sails.config.custom.jsonResponse(" No relation Data Found "  , null))
        }
    },

    createRelation : async function(req , res){
        let rules =[{tagid : "mobileno", text: req.body.relativephone,	regex_name: 'text', errmsg: 'Please Enter the valid mobile No', allow_numbers: true, max : 10, min : 10, required: true}];
        let isValideNumber = await sails.helpers.validation(rules);
		console.log('isValideNumber ' + JSON.stringify(isValideNumber));
		if(isValideNumber.errmsg){
            res.json(sails.config.custom.jsonResponse( isValideNumber.errmsg, null))
		} else{
            let isPresent = await Users.find({contactNo : req.body.relativephone})
                .catch(function (err) {
                    res.json(sails.config.custom.jsonResponse("Something Went Wrong", null));
                });
            if(isPresent.length !== 0){
                let createdRelation = await Relations.create({
                    self_id: req.body.self_id,
                    relative_id : isPresent[0].id,
                    relationship : "Friend",
                })
                .fetch()
                .catch(function (err) {
                    res.json(sails.config.custom.jsonResponse("Something Went Wrong", null));
                  });
                    if(createdRelation){
                        res.json(sails.config.custom.jsonResponse( null , createdRelation));
                    }
                    else
                    {
                        res.json(sails.config.custom.jsonResponse( " something wents wrong " , null))
                    }
            }
            else 
            {
                res.json(sails.config.custom.jsonResponse( "Your Relative Account is not available in this Application" , null))
            }
		 }
    },

    UpdateStatus : async function(req , res){
        let isPresent = await Relations.find({relative_id : req.body.self_id})
                .catch(function (err) {
                    res.json(sails.config.custom.jsonResponse("Something Went Wrong", null));
                });
            if(isPresent.length !==0 ){    
                let UpdateStatus = await Relations.update({id : isPresent[0].id}).set({
                    status : req.body.status
                }).fetch()
                .catch(function (err) {
                    res.json(sails.config.custom.jsonResponse("Something Went Wrong", null));
                });
                if(UpdateStatus.length !== 0){
                    res.json(sails.config.custom.jsonResponse(null, UpdateStatus))
                }
                else
                {
                    res.json(sails.config.custom.jsonResponse( "Relation Status is not Updated" , null))
                }
            }
    }
};

