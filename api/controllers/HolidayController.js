/**
 * HolidayController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	
	getholidayhomeslist: async function(req, res) {
		let holidayhomes = await HolidayHome.find({enabled: true});
		res.json(sails.config.custom.jsonResponse(null, holidayhomes));
	},
	
	bookholidayhome: async function(req,res) {
		//let holidayhome = await HolidayHome.findOne({holidayid: req.body.id});	//	ToDo, change the name of incoming variable
		let member = await Member.findOne({memberid: req.body.user_id});		//	ToDo, member should be sending the id object value
		let holidayhome = await HolidayHome.findOne({id: req.body.id});
		/*
		{ user_id: '14614',
		  id: '5d0b8df419249a77d5b06292',
		  check_in_date: '1561141800000',
		  no_of_days: '2',
		  no_of_rooms: '1' }

		*/
		
		if(member && holidayhome) {
			let holidayhomebooking = await HolidayHomeBooking.create({
				holidayhome: holidayhome.holidayname,
				member: member.id,
				date: req.body.check_in_date,
				days: req.body.no_of_days,
				rooms: req.body.no_of_rooms,
			}).fetch();

			res.json(sails.config.custom.jsonResponse(null, holidayhomebooking));
			
			//	Notify the admin about the booking done
			let notification_body = 'Thank you ! Your request for ' + req.body.no_of_rooms + ' room' + (req.body.no_of_rooms > 1 ? 's' : '') + ' at ' + holidayhome.holidayname + ' (check-in ' + sails.config.custom.getReadableDate(Number(req.body.check_in_date)) + ', for ' + req.body.no_of_days + ' day' + (req.body.no_of_days > 1 ? 's' : '') + ') has been received and we shall update you soon.';
			
			await sails.helpers.sendNotification.with({
				to: member.token,
				title: 'Holiday Home Booking Request',
				body: notification_body,
				data: {
					title: 'Holiday Home Booking Request',
					body: notification_body,
				}
			});
			
			await sails.helpers.sendEmail.with({
				to: 'sbimspatel@gmail.com', 
				subject: 'HH Booking Req - [' + member.membershipno + '-' + member.membername + '] - ' + holidayhome.holidayname , 
				html: '<div><strong><span>Following is the booking request:</span></strong><table border="1"><tbody><tr><td>1. Holiday Home</td><td>'+holidayhome.holidayname+'</td></tr><tr><td>2. Member Name</td><td>'+member.membername+'</td></tr><tr><td>3. Membership No.</td><td>'+member.membershipno+'</td></tr><tr><td>4. Check-in Date</td><td>'+sails.config.custom.getReadableDate(Number(req.body.check_in_date))+'</td></tr><tr><td>5. Number of days</td><td>'+req.body.no_of_days+'</td></tr><tr><td>6. Number of rooms</td><td>'+req.body.no_of_rooms+'</td></tr></tbody></table></div>'});
		} else {
			res.json(sails.config.custom.jsonResponse('Missing data in request, kindly recheck', null));
		}
	},
	
	bookingslist: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		res.view('bookingslist');
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	fetchbookingslist: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		let booking_start_date = Number(req.body.start_date);
		let booking_end_date = Number(req.body.end_date);
		
		if(typeof booking_start_date === 'number' && typeof booking_end_date === 'number') {
			let bookinglist = await HolidayHomeBooking.find({where: {and:[
				{status: {'!=': 'Pending'}},
				{createdAt: {'>': booking_start_date}},
				{createdAt: {'<': booking_end_date}}
			]}}).populate('member');
			res.json(sails.config.custom.jsonResponse(null, bookinglist));
		} else {
			sails.config.log.addlog(1, req.user.email, req.options.action, 'The dates seems to be invalid');
			res.json(sails.config.custom.jsonResponse('The dates seems to be invalid', null));
		}
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	pendingbookingslist: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		let bookinglist = await HolidayHomeBooking.find({status: 'Pending'}).populate('member');
		res.view('pendingbookingslist', {bookinglist: bookinglist, role: req.user.role});
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	approvebooking: async function(req, res) {
		sails.config.log.addINlog(req.user.email, req.options.action);
		sails.config.log.addlog(2, req.user.email, req.options.action, 'bookingid = ' + req.query.bookingid + ', reason = ' + req.query.reason + ', status = ' + (JSON.parse(req.query.approve) ? "Approved" : "Declined"));
	
		let booking = await HolidayHomeBooking.updateOne({id: req.query.bookingid}).set({reason: req.query.reason, status: JSON.parse(req.query.approve) ? "Approved" : "Declined"});
		
		let member = await Member.findOne({id: booking.member});
		
		res.json(sails.config.custom.jsonResponse(null, booking));
		
		//	Notify the member
		{
			sails.config.log.addlog(4, req.user.email, req.options.action, 'Notifying the member');
			let notification_body = JSON.parse(req.query.approve)
			? ('Congratulations ! Your request for ' + booking.holidayhome + ' stands Approved.\n\nNote: ' + booking.reason) 
			: ('We regret to inform you about your request for booking of holiday home at ' + booking.holidayhome + ' stands Declined.\n\nNote: ' + booking.reason);
			await sails.helpers.sendNotification.with({
				to: member.token,
				title: 'Holiday Home Booking Request',
				body: notification_body,
				data: {
					title: 'Holiday Home Booking Request',
					body: notification_body,
				}
			});
		}
		sails.config.log.addOUTlog(req.user.email, req.options.action);
	},
	
	syncbookinglist: async function(req, res) {
		let member = req.body.member;
		let lastSyncedTimestamp = req.body.lastSyncedTimestamp ? Number(req.body.lastSyncedTimestamp) : 0;
		sails.config.log.addINlog(member, req.options.action);
		if(member && _.isNumber(lastSyncedTimestamp)) {
			let time_now = Date.now();
			let bookinglist = await HolidayHomeBooking.find({member: member, updatedAt: {'>': lastSyncedTimestamp}});
			res.json(sails.config.custom.jsonResponse(null, {bookinglist: bookinglist, lastSyncedTimestamp: time_now}));
		} else {
			sails.config.log.addlog(1, member, req.options.action, 'Incorrect data is passed');
			res.json(sails.config.custom.jsonResponse("Incorrect data is passed", null));
		}
		sails.config.log.addOUTlog(member, req.options.action);
	}
};

