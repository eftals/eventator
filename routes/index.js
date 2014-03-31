
var http = require('http');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('login', { title: 'Login' });
};

exports.landing = function(req, res){	
	res.render('landing');
};

exports.login = function(req, res){
	  res.render('login', { title: 'Login' });
	};

exports.getObjects = function(req, response){

   http.get("http://localhost:8080/fedora/objects?pid=true&title=true&terms=&query=&resultFormat=xml", 
    function(res) {
        console.log("Got response: " + res.statusCode);
         res.on('data', function (chunk) {
            response.write(chunk);
         console.log('BODY: ' + chunk);
        });
         res.on('end', function(){
            response.end();
         });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
};


exports.userlist = function(db) {
    return function(req, res) {
        var collection = db.get('usercollection');
        collection.find({},{},function(e,docs){
            res.render('userlist', {
                "userlist" : docs
            });
        });
    };
};
	

exports.newuser = function(req, res){
	  res.render('newuser', { title: 'Add New User' });
};

exports.adduser = function(db) {
    return function(req, res) {

        // Get our form values. These rely on the "name" attributes
        var userName = req.body.username;
        var userEmail = req.body.useremail;

        // Set our collection
        var collection = db.get('usercollection');

        // Submit to the DB
        collection.insert({
            "username" : userName,
            "email" : userEmail
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // If it worked, forward to success page
                res.redirect("userlist");
                // And set the header so the address bar doesn't still say /adduser
               // res.location("userlist");
            }
        });

    }
}