var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var flash    = require('connect-flash');


require('./src/passport')(); // Configure passport

var index = require('./routes/index');
var signup = require('./routes/signup');
var login = require('./routes/login');
var logout = require('./routes/logout');
var manager = require('./routes/manager');
var user = require('./routes/user');
var planes = require('./routes/planes');
var flights = require('./routes/flights');
var search = require('./routes/search');
var bookings = require('./routes/bookings');
var userinfo = require('./routes/userinfo');
var map = require('./routes/map');
var about = require('./routes/about');
var checkin = require('./routes/checkin');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({secret: 'badabingbadaboom'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/', index);
app.use('/signup', signup);
app.use('/manager', manager);
app.use('/login', login);
app.use('/logout', logout);
app.use('/user', user);
app.use('/planes', planes);
app.use('/flights',flights);
app.use('/search', search);
app.use('/bookings', bookings);
app.use('/userinfo', userinfo);
app.use('/map', map);
app.use('/about', about);
app.use('/checkin', checkin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('404', {shouldDisplayLogin: 2});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
