/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

	'GET /logit': 					function(req, res) {
		sails.config.log.addlog(0, 'Naval', 'logit', 'log message');	//	ERROR	//	Errors
		sails.config.log.addlog(1, 'Naval', 'logit', 'log message');	//	WARN	//	When we do not want this to happen
		sails.config.log.addlog(2, 'Naval', 'logit', 'log message');	//	DEBUG	//	When we want to observe the values
		sails.config.log.addlog(3, 'Naval', 'logit', 'log message');	//	INFO	//	When we need to know whats happening
		sails.config.log.addlog(4, 'Naval', 'logit', 'log message');	//	VERBOSE	//	Any damn thing
		sails.config.log.addlog(5, 'Naval', 'logit', 'log message');	//	SILLY	//	Don't care
		res.ok();
	},
	'GET /probe': 					function(req, res) {res.ok()},
	'/': 							'AuthController.index',
	'GET /login': 					'AuthController.loginget',
	'POST /login': 					'AuthController.login',
	'GET /register': 				'AuthController.getregister',
	'POST /register': 				'AuthController.register',
	'GET /logout': 					'AuthController.logout',
	'GET /resetpassword':			'AuthController.resetpassword',
	'POST /passwordresetreq':		'AuthController.passwordresetreq',
	'POST /performresetpassword':	'AuthController.performresetpassword',
	
	'GET /userlist':			'UserController.userlist',
	'GET /usercreate':			'UserController.getusercreate',
	'POST /usercreate':			'UserController.usercreate',
	'POST /useractivestatus':	'UserController.useractivestatus',
	'POST /userdelete':			'UserController.userdelete',
	'GET /useredit/:id':		'UserController.usereditget',
	'POST /useredit':			'UserController.usereditpost',
	
	'GET /memberlist':				'MembersController.memberlist',
	'GET /membercreate':			'MembersController.getmembercreate',
	'POST /membercreate':			'MembersController.membercreate',
	'POST /memberactivestatus':		'MembersController.memberactivestatus',
	'POST /memberdelete':			'MembersController.memberdelete',
	'GET /memberedit/:id':			'MembersController.membereditget',
	'POST /memberedit':				'MembersController.membereditpost',
	
	
	'GET /relationlist/:id':		'RelationController.relationlist',

	'GET /bookingslist':		'HolidayController.bookingslist',
	'GET /pendingbookingslist':	'HolidayController.pendingbookingslist',
	'POST /approvebooking':		'HolidayController.approvebooking',
	'POST /fetchbookingslist':	'HolidayController.fetchbookingslist',
	
	'GET /upload':				'UploadController.getupload',
	'POST /upload':				'UploadController.postupload',
	
	'GET /pendingcheckertasks':	'CheckerController.pendingcheckertasks',
	'POST /approvecheckertask':	'CheckerController.approvecheckertask',
	'GET /checkertasklist':		'CheckerController.checkertasklist',
	'POST /fetchcheckertasklist':'CheckerController.fetchcheckertasklist',
	
	'GET /content':				'ContentController.content',
	'POST /savecontentfor':		'ContentController.savecontentfor',
	'POST /getcontentfor':		'ContentController.getcontentfor',
	
	'GET /xls': async function(req, res) {
		//await sails.helpers.updateFromDbf.with({uploaded_files: ['/home/ubuntu/servers/sbimspatel_server/uploadeddbf/2019/8/29/15670939347031567071602402MEMBER.DBF']});
		await sails.helpers.sendEmail.with({
				to: 'sbimspatel@gmail.com', 
				cc: 'naval@mobigic.com',
				subject: 'HH Booking Req - [Testing]', 
				html: 'Testing emails'});
		res.send('done');
	},
	
	'GET /maxdays': function(req, res) {
		res.ok(30);
	},

	/***************************************************************************
	*                                                                          *
	* More custom routes here...                                               *
	* (See https://sailsjs.com/config/routes for examples.)                    *
	*                                                                          *
	* If a request to a URL doesn't match any of the routes in this file, it   *
	* is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
	* not match any of those, it is matched against static assets.             *
	*                                                                          *
	***************************************************************************/

	/*********************************************************
					All RESTful API here
	*********************************************************/
	
	  'POST /createUser': 'UpdateProfileController.createUser',
	  'GET /getUser' : 'UpdateProfileController.getUser',
	  'POST /createRelation': 'MangeRelationController.createRelation',
	  'PUT /updateRelationStatus': 'MangeRelationController.updateRelationStatus',
	  'GET /getRelation' : 'MangeRelationController.getRelation',
	  'POST /uploadPhoto' : 'UpdateProfileController.uploadPhoto',
	  'POST /deleteRelation': 'MangeRelationController.deleteRelation',
  		
	'GET /getmemberbyphone':			'MemberController.getmemberbyphone',
	'POST /setmembertoken':				'MemberController.setmembertoken',
	'GET /memberstatement': 			'MemberController.memberstatement',
	'POST /getopeningbalanceformember':	'OpeningBalanceController.getopeningbalanceformember',
	'GET /getholidayhomeslist': 		'HolidayController.getholidayhomeslist',
	'POST /gettransactionsformember': 	'TransactionController.gettransactionsformember',
	'POST /bookholidayhome': 			'HolidayController.bookholidayhome',
	'POST /syncbookinglist': 			'HolidayController.syncbookinglist',
	'GET /getforms': 					'FormController.getforms',
	'POST /loandetails':				'LoanController.loandetails',
	'POST /fdrdetails':					'FdrController.fdrdetails',
	
	/*********************************************************
					All VALI Theme pages here
	*********************************************************/
	
	'/blank-page': 				{view: 'vali/blank-page'},
	'/bootstrap-components': 	{view: 'vali/bootstrap-components'},
	'/charts': 					{view: 'vali/charts'},
	'/form-components': 		{view: 'vali/form-components'},
	'/form-custom': 			{view: 'vali/form-custom'},
	'/form-notifications': 		{view: 'vali/form-notifications'},
	'/form-samples': 			{view: 'vali/form-samples'},
	'/vali': 					{view: 'vali/vali'},
	'/page-calendar': 			{view: 'vali/page-calendar'},
	'/page-error': 				{view: 'vali/page-error'},
	'/page-invoice': 			{view: 'vali/page-invoice'},
	'/page-lockscreen': 		{view: 'vali/page-lockscreen'},
	'/page-login': 				{view: 'vali/page-login'},
	'/page-mailbox': 			{view: 'vali/page-mailbox'},
	'/page-user': 				{view: 'vali/page-user'},
	'/table-basic': 			{view: 'vali/table-basic'},
	'/table-data-table': 		{view: 'vali/table-data-table'},
	'/ui-cards': 				{view: 'vali/ui-cards'},
	'/widgets': 				{view: 'vali/widgets'},
	
};

/*
- obtain inward outward xls
- all masters before 10 june.
- provide with sample email address working with go daddy smtp . pop3

  max 4 days for holidays and max 2 rooms
  show the details for last FY and this FY
  show forms list , add new form, delete the form.
  let pdf get downloaded on phone
- show last 4 digits of the account number and xxxx for all.
- show how many are mobile users, and show the list of users who have not used the app.
  delete the booking request once date is past
Q provide an api for approving or decline for holiday homes. send an email for holidayhomes with the request id.

   holiday homes to be in pending state, approve / decline with a reason, and notify [SHOULD WE SHOW THE HISTORY OF BOOKING?]
   surety to be included showing whom i am added as surety and who all i have added as surety. show it next to statement.
   store phone number as md5
m- provide consolidated statement for previous year in pdf.
m- notification to carry the section it should open
  show opening balance with the date of the last known transaction in system.

Q auto disable the user on end of month as retirement
  approver based solution
- download the annual pdf file (big size pdf). sample pdf to be provided.

  app side dd/mm/yyyy format for all dates
  forgot password
- remove document
  transaction reqires account D/C with dates and not repeated data
  transactions show opening balance on top
  closing balace will be shown in the end.
  desc in bottom or show short desc
  Account should show current balance and not opening balance
  transactions will be 4 column display with date, month of posting,short description, Amt C/D
  check-in date max 120 days - configurable

  add cron job for updating the values of timestamp and year - pending job
  uncomment the openingbalance to filter by thisyear till then we are using default
- make availability of uploading the dbf file only
- validations
- logs
  send notifications to required ppl
- notification sending screen
  sending of email not working
- change the email address from www.naval.com@gmail.com to whatever is required
- datatable server logic

	1. PF No. & RES Address, Share capital Missing… Branch name is coming as Bank account no. - Check
	2. Address in the Holiday Home
	3. Holiday home Contact to be removed
4. Configuration to be given on admin portal for Number of days of advance booking - Currently to be kept 60.
5. After the Request of Holiday home is made.. show the message and get the user to the home page of Holiday home Booking history page. Menu item of the history to be moved inside.
	6. Remove Plus (+) sign from Booking history.
	7. OTP wordings to be changed. - Check
8. Annual Report Field in Hamburger Menu.  - Year wise to be uploaded and shown.
	9. Info Menu to be added for Information of Society and Schemes (Text file) - Editing via Admin Panel
	10. Landing page to be the Menus items of the Hamburger.
	11. Welcome Card - User Name
	12. Board Member Details - Editing thru Admin Panel - Menu Item to be added
	13. Contact Us / Branch Offices
14. Marathi & Hindi names for all menu items
	15. Sureties to Others & Sureties to me - Add in Member Profile
	16. Holiday Home Terms & Conditions to be added before proceeding to request a booking.
    something new for upload (FDR)
	Displaying FDR
    change launcher icon
    change application name
    check application package name or change it as required

db.user.createIndex({phone: 1}, {unique: true});db.branch.createIndex({branchid: 1}, {unique: true});db.account.createIndex({account_id: 1}, {unique: true});db.holidayhome.createIndex({holidayid: 1}, {unique: true});db.member.createIndex({memberid: 1}, {unique: true});db.setting.createIndex({name: 1}, {unique: true});


*/
