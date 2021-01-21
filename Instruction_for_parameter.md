This POST-Api for User Registration
API- http://13.232.145.240:1337/createUser 

send Parameter like this field Name : 
{
    "userphone" : "8956634859",
    "fname" : "Bhakti",
    "lname" : "Thakar",
    "mname" : "Namdev",
    "address" : "Bhangar wadi",
    "pincode" : "435151",
    "state" : "Maharashtra",
    "city" : "Pune",
    "dob" : "15121996"
}

This GET-Api for Retrived User Details
API- http://13.232.145.240:1337/getUser

send Parameter like this field Name : 
{
"params' : {
"userphone" : "9820655695"
}}

This POST-Api for Create Relationship
API- http://13.232.145.240:1337/createRelation

send Parameter like this field Name :
{
"relativephone" : "8956634859",
"self_id" : "60082965fe056412ac5ea8db"
}


This GET-Api for Retrived the Relation Table Data if anyone crated your Relation connection 
API- http://13.232.145.240:1337/getRelation

send Parameter like this field Name :
{
params : {
self_id : "60082a06fe056412ac5ea8dc"
}
here you want to pass self_id

This POST-Api for Update the Status like Appoved, Discarded
API- http://13.232.145.240:1337/UpdateStatus

send Parameter like this field Name :
{
"self_id" : "60082a06fe056412ac5ea8dc",
"status" : "Approved"
}

 

  