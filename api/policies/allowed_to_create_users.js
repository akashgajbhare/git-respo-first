/**
 * allow to create users
 */

module.exports = function (req, res, ok) {
	if(req.user && sails.config.custom.user_create[req.user.role]) {
		return ok();
	} else {
		return res.redirect('/login');
	}
};