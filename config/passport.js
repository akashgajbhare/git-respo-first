const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      bcrypt = require('bcrypt-nodejs');

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb){
  /*User.findOne({id}, function(err, user) {
    cb(err, users);
  });*/
	cb(null, user);
});

passport.use(new LocalStrategy({
  usernameField: 'username',
  passportField: 'password'
}, function(username, password, cb){

	User.findOne({email: username}, function(err, user){
		if(err) return cb(err);
		if(!user) return cb(null, false, {message: 'Username not found'});
		if(!user.enabled) return cb(null, false, {message: 'User is disabled'});

		bcrypt.compare(password, user.password, function(err, res){
			if(!res) return cb(null, false, { message: 'Invalid Password' });

			let userDetails = {
				email: user.email,
				username: user.email,
				name: user.name,
				role: user.role,
				zone: user.zone,
				branch: user.branch,
				id: user.id
			};

			return cb(null, userDetails, { message: 'Login Succesful'});
		});
	});
}));