var http = require('http'),
    express = require('express'),
    passport = require('passport'),
    flash = require('connect-flash'),
    routes = require('./routes'),
	path = require('path'),
	mongoose = require('mongoose'),
	mongo = require('mongodb'),
	monk = require('monk'),
	db = monk('localhost:27017/Eventator'),
	user = require('./routes/user');

   

app = express();


app.configure(function(){
    app.use(express.cookieParser('some secret'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieSession());
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.set('port', process.env.PORT || 8080);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.static(path.join(__dirname + '/public/stylesheets')));
    app.use(express.static(path.join(__dirname + '/views')));
    app.engine('html', require('ejs').renderFile);
});


//setup passport
require('./routes/passport.js')(passport, db);

app.get('/', routes.login);
app.get('/login', routes.login);
app.get('/landing', routes.landing);
app.post('/login', 
    passport.authenticate('local', { 
    	successRedirect: '/landing',
    	failureRedirect: '/login', 
    	failureFlash: true }),
        function(req, res) {
        res.redirect('/');
});

//setup server
http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
