/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const https = require('https')
module.exports = {

    notificaton: function (req, res) {
        res.view('notification');
    },

    sendnotification: async function (req, res) {
        if (req.body.notificationtext || req.body.notificationcity) {
            let apiKey = sails.config.custom.serverKey;
            console.log(apiKey);
            let ttl = 24*60*60;
            let notification_message = req.body.notificationtext
            let to = "/topics/"+req.body.notificationcity;
            let notification_data={}
                notification_data.body =req.body.notificationtext
                notification_data.city = req.body.notificationcity
                notification_data.title= 'Babaji'

            // await sails.helpers.sendNotification.with({
            //     to: to,
            //     title: 'Babaji',
            //     body: notification_message,
            //     data: {
            //         body : notification_message,
            //         city : req.body.notificationcity,
            //         title : 'Babaji',
            //     }
            // });

            try
            {
               let result = await sendFCM(apiKey,to, ttl, notification_message, notification_data);
               console.log(result.message_id);
               if(result){
                    return res.view('notification', sails.config.custom.jsonResponse(null, "Notification send Successfully"))
               }
               else
               {
                    return res.view('notification', sails.config.custom.jsonResponse("try again.."), null);
               }
            }catch(err){
                console.log(err);
            }
        }
        else {
            return res.view('notification', sails.config.custom.jsonResponse("Please provide the Importaant Fields like city and notification content.."), null);
        }
    }
};

function sendFCM(apiKey, to, expiry, notification_message, notification_data) {
    return new Promise(function(good, bad) {
        let logFCM = true
        /*console.log(to);
        console.log(message);
        console.log(expiry);
        console.log(is_iot);*/
        //  Construct the JSON that you want to send for the notification to work
        var fcmData = {};
        fcmData.to = to; //'/topics/' +
        fcmData.time_to_live = expiry / 1000;
        fcmData.data = notification_data;
        fcmData.notification = {};
        fcmData.notification.title = 'Babaji';
        fcmData.notification.body = notification_message;
        let jsonData = JSON.stringify(fcmData);
        console.log(jsonData);
        //cb(null); //  naval
        //return;   // naval

        var options = {
            hostname: 'fcm.googleapis.com',
            port: 443,
            path: '/fcm/send',
            method: 'POST',
            headers: {
                'User-Agent': 'www.babaji.com',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonData),
                'Authorization': "key="+apiKey
            },
        };

        var req = https.request(options, function (res) {
        if (logFCM) {
                    console.log('Status: ' + res.statusCode);
                    console.log('Headers: ' + JSON.stringify(res.headers));
                }
                res.setEncoding('utf8');
            
                res.on('data', function (body) {
                    if (logFCM)
                        console.log('Body: ' + body);
                        good(body);
                    console.log(body);
                });

                req.on('error', function (e) {
                    console.log('problem with request: ' + e);
                    bad(e);
                });
        });

        // write data to request body
        req.write(jsonData);
        req.end();
    })
}
