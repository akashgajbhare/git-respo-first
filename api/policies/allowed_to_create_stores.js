/**
 * allow to create stores
 */

module.exports = function (req, res, ok) {
	if(req.user && sails.config.custom.store_create[req.user.role]) {
		return ok();
	} else {
		return res.redirect('/login');
	}
};