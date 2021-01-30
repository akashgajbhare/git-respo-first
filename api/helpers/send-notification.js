var FCM = require('fcm-node');
var fcm = new FCM(sails.config.custom.serverKey);

var Queue = require('better-queue');
var notification_queue = new Queue(function (inputs, cb) {

	sails.config.log.addINlog('helper', 'send-notification-queue');
	if(inputs.to) {
		var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			to: inputs.to, 
			//collapse_key: 'your_collapse_key',

			notification: {
				title: inputs.title, 
				body: inputs.body 
			},

			data: inputs.data,

			ttl: 24*60*60	//	1 day
		};

		sails.config.log.addlog(4, 'helper', 'send-notification-queue', 'sending notification now');
		fcm.send(message, function(err, response){
			if (err) {
				console.log(err);
				console.log("Something has gone wrong!");
				sails.config.log.addlog(0, 'helper', 'send-notification-queue', err);
				cb(err, null);
			} else {
				console.log("Notification Successfully sent with response: ", response);
				sails.config.log.addOUTlog('helper', 'send-notification-queue');
				cb(null, {});
			}
		});
	} else {
		console.log('could not send the notification to empty token');
		sails.config.log.addlog(1, 'helper', 'send-notification-queue', 'could not send the notification to empty token');
		sails.config.log.addOUTlog('helper', 'send-notification-queue');
		cb('could not send the notification to empty token', null);
	}
});

module.exports = {


	friendlyName: 'Send notification',


	description: '',


	inputs: {
		to:			{type: 'string'},
		
		title:		{type: 'string'},
		body:		{type: 'string'},

		data:		{type: 'json'}
	},


	exits: {

	},


	fn: function (inputs, exits) {

		//	Disabling the EMAIL since we do not have the email account via which the sending of email should happen
		/*console.log('sending email to ' + inputs.to + ', with subject = ' + inputs.subject);
		console.log('Email is disabled as there is no email account linked')
		exits.success(true);
		return;*/

		sails.config.log.addINlog('helper', 'send-notification');
		notification_queue.push(inputs);
		sails.config.log.addOUTlog('helper', 'send-notification');
		exits.success(true);
	}
};
