   

LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport, db) {

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("Hit authenticator for user:" + username);
        var collection = db.get('users');
        collection.findOne({"username": username, "password":password}, function(err, users) {
        	  if( err || !users) 
        		  {
        		  	console.log("No user/pwd combo found");
        		  	return done(null, false, { message: 'Incorrect login.' });
        		  }
        	  else
        		  {
        		  	console.log('gotuser');        		 
        		  	return done(null, {"id": users.id, 
        			    "username": users.username, 
        				"password": users.password})
        		  }        		        		  
        	});
        }));
};