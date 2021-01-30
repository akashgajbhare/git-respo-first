const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport

let transporter = nodemailer.createTransport({
	host: 'mail.sbimspatel.com',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: "mspwebapp@sbimspatel.com", // generated ethereal user
		pass: "mobijik@2019"  // generated ethereal passwod
	},
	requireTLS : false,
	tls: {rejectUnauthorized: false}
});

var Queue = require('better-queue');
var email_queue = new Queue(function (inputs, cb) {
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	sails.config.log.addINlog('helper', 'send-email-queue');
	nodemailer.createTestAccount((err, account) => {
		// setup email data with unicode symbols
		let mailOptions = {};
		mailOptions.from = 'mspwebapp@sbimspatel.com'; // sender address

		if(inputs.to)
			mailOptions.to = inputs.to; // list of receivers
		if(inputs.cc)
			mailOptions.cc = inputs.cc;	// list of all receivers in bcc
		if(inputs.bcc)
			mailOptions.bcc = inputs.bcc;	// list of all receivers in bcc
		if(inputs.subject)
			mailOptions.subject = inputs.subject; // Subject line
		if(inputs.body)
			mailOptions.text = inputs.body; // plain text body
		if(inputs.html)
			mailOptions.html = inputs.html; // html body
		if(inputs.attachment)
			mailOptions.attachments = [{
				filename: inputs.attachment.substr(inputs.attachment.indexOf('/')+1),
				path: inputs.attachment,
				contentType: 'application/pdf'
			}];
		
		sails.config.log.addlog(4, 'helper', 'send-email-queue', 'sending email');
		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				sails.config.log.addlog(0, 'helper', 'send-email-queue', 'error in sending email');
				console.log(' - ' + new Date() +' ERR - (send-email - helper)' + error);
			} else {
				console.log(info);
				sails.config.log.addlog(4, 'helper', 'send-email-queue', 'sending of email was successful');
			}
			cb();
			sails.config.log.addOUTlog('helper', 'send-email-queue');
		});
	});
});

module.exports = {


	friendlyName: 'Send email',


	description: '',


	inputs: {
		to:			{type: 'string'},
		cc:			{type: 'string'},
		bcc:		{type: 'string'},

		subject:	{type: 'string'},

		body:		{type: 'string'},
		html:		{type: 'string'},

		attachment:	{type: 'string'}
	},


	exits: {

	},


	fn: function (inputs, exits) {

		//	Disabling the EMAIL since we do not have the email account via which the sending of email should happen
		/*console.log('sending email to ' + inputs.to + ', with subject = ' + inputs.subject);
		console.log('Email is disabled as there is no email account linked')
		exits.success(true);
		return;*/

		sails.config.log.addINlog('helper', 'send-email');
		//email_queue.push(inputs);
		sails.config.log.addOUTlog('helper', 'send-email');
		exits.success(true);
	}
};
