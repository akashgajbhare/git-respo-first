/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  	//'*': false,
	
	'auth': {
		'*': ['authenticated'],
		'loginget': true,
		'login': true,
		'logout': true,
		'getregister': true,
		'register': true,
		'passwordresetreq': true,
		'resetpassword': true,
		'performresetpassword': true
	},
	
	'user': {
		'*': ['authenticated', 'refreshSessionCookie'],
		'usercreate': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],
		'getusercreate': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],
		'usereditget': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],
		'usereditpost': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],
		'useractivestatus': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],
		'userdelete': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie']
	},
	
	'members': {
		'*': ['authenticated', 'refreshSessionCookie'],
		'membercreate': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],
		'getmembercreate': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],
		'membereditget': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],
		'membereditpost': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],
		'memberactivestatus': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],
		'memberdelete': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],

	},
	'relation' :{
		'*': ['authenticated', 'refreshSessionCookie'],
		'relationlist': ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],
	},
	
	'notification':{
		'*' : ['authenticated', 'refreshSessionCookie'],
		'sendnotification' : ['authenticated', 'allowed_to_create_users', 'refreshSessionCookie'],
	},
	
	'upload': {
		'*': ['authenticated', 'refreshSessionCookie'],
		'postupload': true
	},
	
	'openingbalance' : {
		'*': ['authenticated', 'refreshSessionCookie'],
		//'getopeningbalanceformember': true
		'getopeningbalanceformember': ['authenticated_mobile_user']
	},
	
	'transaction': {
		'*': ['authenticated', 'refreshSessionCookie'],
		//'gettransactionsformember': true
		'gettransactionsformember': ['authenticated_mobile_user']
	},
	
	'holiday': {
		'*': ['authenticated', 'refreshSessionCookie'],
		'getholidayhomeslist': true,
		//'bookholidayhome': true,
		'bookholidayhome': ['authenticated_mobile_user'],
		//'syncbookinglist': true
		'syncbookinglist': ['authenticated_mobile_user']
	},
	
	'loan': {
		'*': ['authenticated', 'refreshSessionCookie'],
		//'loandetails': true,
		'loandetails': ['authenticated_mobile_user']
	},
	
	'fdr': {
		'*': ['authenticated', 'refreshSessionCookie'],
		//'fdrdetails': true,
		'fdrdetails': ['authenticated_mobile_user'],
	},
	
	'checker': {
		'*': ['authenticated', 'refreshSessionCookie'],
	},
	
	'content': {
		'*': ['authenticated', 'refreshSessionCookie'],
	}
};
