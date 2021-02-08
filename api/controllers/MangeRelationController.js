/**
 * MangeRelationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
    getRelation : async function (req , res){
        let data ={}
        let getRequested = await Relations.find({relative_id : req.query.self_id})
        let selfCreated = await Relations.find({self_id : req.query.self_id})
        if(getRequested.length !== 0 || selfCreated.length !== 0){
            data.getRelativeRequest = getRequested
            data.selfCreated = selfCreated
		    res.json(sails.config.custom.jsonResponse( null , data));
        }else
        {
            res.json(sails.config.custom.jsonResponse(" No relation Data Found "  , null))
        }
    },

    createRelation : async function(req , res){
        let rules =[{tagid : "mobileno", text: req.body.relativephone,	regex_name: 'text', errmsg: 'Please Enter the valid mobile No', allow_numbers: true, max : 10, min : 10, required: true}];
        let isValideNumber = await sails.helpers.validation(rules);
		if(isValideNumber.errmsg){
            res.json(sails.config.custom.jsonResponse( isValideNumber.errmsg, null))
		} else{
            let UserData = await Members.find({contactNo : req.body.relativephone})
                .catch(function (err) {
                    res.json(sails.config.custom.jsonResponse("Something Went Wrong", null));
                });
                if(UserData.length !== 0){
                    if(req.body.self_id === UserData[0].id)
                    {
                        res.json(sails.config.custom.jsonResponse("You cannot create relation with your self", null));
                    } 
                    else
                    {   
                       // let selfCreatedCount = await Relations.count({self_id: req.body.self_id, relative_id: UserData[0].id })
                        //let getRequestCount = await Relations.count({self_id: UserData[0].id, relative_id: req.body.self_id })
                        //if(selfCreatedCount === 0 && getRequestCount === 0){
                            let createdRelation = await Relations.create({
                                self_id: req.body.self_id,
                                relative_id : UserData[0].id,
                                relationship : req.body.relationship,
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
                                    res.json(sails.config.custom.jsonResponse( " Something wents wrong " , null))
                                }
                        // }
                        // else
                        // {   if(selfCreatedCount > 0)
                        //     {
                        //         res.json(sails.config.custom.jsonResponse( "You already send the relation request to this phone no." , null)) 
                        //     }else if (getRequestCount > 0){
                        //         res.json(sails.config.custom.jsonResponse( "Relative client no. already send you request for making relation" , null)) 
                        //     }
                        // }
                    }  
                }
                else
                {
                    res.json(sails.config.custom.jsonResponse( "Your Relative Account is not available in this Application" , null))
                }

		 }
    },

    updateRelationStatus : async function(req , res){
        let relationData = await Relations.find({id : req.body.id})
                .catch(function (err) {
                    res.json(sails.config.custom.jsonResponse("Something Went Wrong", null));
                });
            if(relationData.length !== 0 ){    
                let UpdateStatus = await Relations.update({id : req.body.id}).set({
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
            else
            {
                res.json(sails.config.custom.jsonResponse( "Relation data is not found.." , null))
            }
    },

    deleteRelation : async function(req, res){
        await Relations.destroy({ id: req.body.id });
        let checkRecord = await Relations.count({ id: req.body.id })
        if (checkRecord === 0) {
            res.json(sails.config.custom.jsonResponse(null, "Record deleted Successfully"))
        }
        else {
            res.json(sails.config.custom.jsonResponse("Data is not Deleted due to some technical issue", null))
        }
    },
};

