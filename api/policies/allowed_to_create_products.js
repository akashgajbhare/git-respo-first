/**
 * allow to create products
 */

module.exports = function (req, res, ok) {
	if(req.user && sails.config.custom.product_create[req.user.role]) {
		return ok();
	} else {
		return res.redirect('/login');
	}
};