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

Response :
{
    "data": [
        {
            "createdAt": 1611147782579,
            "updatedAt": 1611641642700,
            "id": "60082a06fe056412ac5ea8dc",
            "contactNo": "8956634859",
            "first_Name": "Bhakti",
            "middle_Name": "Namdev",
            "last_Name": "Thakar",
            "dob": 15121996,
            "address": "Bhangar wadi",
            "pincode": "435151",
            "state": "Maharashtra",
            "city": "Pune",
            "enabled": true
        }
    ]
}




This GET-Api for Retrived User Details
API- http://13.232.145.240:1337/getUser
http://13.232.145.240:1337/getUser?userphone=8956634859
send Parameter like this field Name : 
{
"userphone" : "8956634859"
}

Response :
{
    "data": [
        {
            "createdAt": 1611147782579,
            "updatedAt": 1611257343783,
            "id": "60082a06fe056412ac5ea8dc",
            "contactNo": "8956634859",
            "first_Name": "Bhakti",
            "middle_Name": "Namdev",
            "last_Name": "Thakar",
            "dob": 15121996,
            "address": "Bhangar wadi",
            "pincode": "435151",
            "state": "Maharashtra",
            "city": "Pune",
            "enabled": true
        }
    ]
}



This POST-Api for Create Relationship
API- http://13.232.145.240:1337/createRelation

send Parameter like this field Name :
{
"relativephone" : "8956634859",
"self_id" : "60082965fe056412ac5ea8db",
"relationship" : "Friend"
}

Response :
{
    "data": {
        "createdAt": 1611637989795,
        "updatedAt": 1611637989795,
        "id": "600fa4e5ecaa822c48669ef0",
        "self_id": "60093e0b71f48a250453126b",
        "relative_id": "60082a06fe056412ac5ea8dc",
        "relationship": "sun",
        "status": "Pending"
    }
}



This GET-Api for Retrived the Relation Table Data if anyone crated your Relation connection 
API- http://13.232.145.240:1337/getRelation
http://13.232.145.240:1337/getRelation?self_id=60082a06fe056412ac5ea8dc
send Parameter like this field Name :
{
self_id : "60082a06fe056412ac5ea8dc"
}
here you want to pass self_id


Response : 
{
    "data": {
        "getRelativeRequest": [
             {
                "createdAt": 1611744860749,
                "updatedAt": 1611744860749,
                "id": "6011465c7ee58f4320cc1974",
                "self_id": "60082a06fe056412ac5ea8dc",
                "relative_id": "60082965fe056412ac5ea8db",
                "relationship": "Friend",
                "status": "Pending"
            },
            {
                "createdAt": 1611744860749,
                "updatedAt": 1611744860749,
                "id": "6011465c7ee58f4320cc1974",
                "self_id": "60082a06fe056412ac5ea8dc",
                "relative_id": "60082965fe056412ac5ea8db",
                "relationship": "Friend",
                "status": "Pending"
            }
        ],
        "selfCreated": [
            {
                "createdAt": 1611744860749,
                "updatedAt": 1611744860749,
                "id": "6011465c7ee58f4320cc1974",
                "self_id": "60082a06fe056412ac5ea8dc",
                "relative_id": "60082965fe056412ac5ea8db",
                "relationship": "Friend",
                "status": "Pending"
            },
             {
                "createdAt": 1611744860749,
                "updatedAt": 1611744860749,
                "id": "6011465c7ee58f4320cc1974",
                "self_id": "60082a06fe056412ac5ea8dc",
                "relative_id": "60082965fe056412ac5ea8db",
                "relationship": "Friend",
                "status": "Pending"
            }
        ]
    }
}


This PUT-Api for Update the Status like Appoved, Declined
API- http://13.232.145.240:1337/updateRelationStatus

send Parameter like this field Name :
{
"self_id" : "60082a06fe056412ac5ea8dc",
"status" : "Approved",
"relative_id" : "60093e0b71f48a250453126b"
}

Response :
{
    "data": [
        {
            "createdAt": 1611637989795,
            "updatedAt": 1611640988898,
            "id": "600fa4e5ecaa822c48669ef0",
            "self_id": "60093e0b71f48a250453126b",
            "relative_id": "60082a06fe056412ac5ea8dc",
            "relationship": "sun",
            "status": "Approved"
        }
    ]
}

This POST-Api for Update Profile Picture
API- http://13.232.145.240:1337/uploadPhoto

send Parameter like this field Name :
{
"self_id" : "60082a06fe056412ac5ea8dc",
"photo" : fileevent
}
in the photo filed pass the file event. 


This POST-Api for Delete the Relation table field using Relation Table Id
API- http://13.232.145.240:1337/deleteRelation

send Parameter like this field Name :
{
"id" : "6008360492351a10b4916012"
}

Response :
{
    "data": "Record deleted Successfully"
}