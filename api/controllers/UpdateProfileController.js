/**
 * UpdateProfileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
    justvalidate: async function (req, res) {
        let rules = [{ tagid: "mobileno", text: '2555533385', regex_name: 'text', errmsg: 'Please Enter the valid input', allow_numbers: true, max: 10, min: 10, required: true }];

        let isValideNumber = await sails.helpers.validation(rules);
        console.log('isValideNumber ' + JSON.stringify(isValideNumber));
        if (isValideNumber.errmsg) {
            res.json(sails.config.custom.jsonResponse(isValideNumber.errmsg, null))
        } else { }
    },

    getUser: async function (req, res) {
        if (req.query.userphone) {
            let getDetails = await Users.find({ contactNo: req.query.userphone }).catch(function (err) {
                res.json(sails.config.custom.jsonResponse("Something went wrong", null))
            })
            if (getDetails.length !== 0) {
                res.json(sails.config.custom.jsonResponse(null, getDetails))
            }
            else {
                res.json(sails.config.custom.jsonResponse("User details is not available", null))
            }
        }
        else {
            res.json(sails.config.custom.jsonResponse("User details is not available", null))
        }
    },

    createUser: async function (req, res) {
        let rules;
        if(req.body.userphone){
            rules = [{ tagid: "mobileno", text: req.body.userphone, regex_name: 'text', errmsg: 'Please enter the valid mobile No', allow_numbers: true, max: 10, min: 10, required: true }];
        }
        else
        { 
            res.json(sails.config.custom.jsonResponse(" Your mobile no. is not getting", null))
        }
        let isValideNumber = await sails.helpers.validation(rules);
        console.log('isValideNumber ' + JSON.stringify(isValideNumber));
        if (isValideNumber.errmsg) {
            res.json(sails.config.custom.jsonResponse(isValideNumber.errmsg, null))
        } else {
            let contactno = req.body.userphone
            let fname = req.body.fname
            let lname = req.body.lname
            let mname = req.body.mname
            let address = req.body.address
            let pincode = req.body.pincode
            let state = req.body.state
            let city = req.body.city
            let dob = req.body.dob
            let createdUser = await Users.findOrCreate({
                contactNo: contactno
            }, {
                contactNo: contactno,
                first_Name: fname,
                middle_Name: mname,
                last_Name: lname,
                address: address,
                pincode: pincode,
                state: state,
                city: city,
                dob: dob,
            })
            console.log(createdUser);
            if (createdUser) {
                let updateUser = await Users.update({
                    id: createdUser.id
                }, {
                    contactNo: contactno,
                    first_Name: fname,
                    middle_Name: mname,
                    last_Name: lname,
                    address: address,
                    pincode: pincode,
                    state: state,
                    dob: dob,
                    city: city,
                }).fetch()
                if (updateUser) {
                    res.json(sails.config.custom.jsonResponse(null, updateUser))
                }
            }

        }
    },
    
    uploadPhoto : function(req, res){
        //stream Content all file Details. 
        let file = req.file('flightsUpload')._files[0].stream
        let allowedTypes  = ['image/jpeg', 'image/png'];
        if(_.indexOf(allowedTypes, file.headers['content-type']) === -1) //headers['content-type'] contain the  file type
        {
            console.log("Wrong file format");
            res.json(sails.config.custom.jsonResponse("You are select wrong file. Please select jpeg, png file.", null))
        }
        else
        {
            sails.config.globals.getdumppath('Flights', async function(err, path) {
                console.log(path);
                req.file('flightsUpload').upload({
                    dirname: ('../..'+ path),
                    // You can apply a file upload limit (in bytes)
                },
                async function (err, uploadedFiles) {
                    if (err) return res.serverError(err);
                    console.log(uploadedFiles[0].fd);
                    
                    // if(uploadedFiles.length !== 0){
                    //     let update = Users.update({id : req.body.self_id}).set({photo: uploadedFiles[0].fd}).fetch()
                    //     .catch(function (err) {
                    //         console.log(err);
                    //         res.json(sails.config.custom.jsonResponse("Something Went Wrong", null));
                    //     });
                    //     if(update !== 0){
                            res.json(sails.config.custom.jsonResponse(null, "Photo upload Successfully"))
                    //     }else
                    //     {   
                    //         res.json(sails.config.custom.jsonResponse("Something went wrong, please try again later.." , null))
                    //     }
                    // }                        
                });
            })
        }
    },
};

