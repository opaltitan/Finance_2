process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoose = require('./config/mongoose');
var http = require('http');
var socketio = require('socket.io');
var dl = require('delivery');
var compress = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var apassport = require('passport');
var uPassport = require('./config/passport');

var db = mongoose();

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

if(process.env.NODE_ENV === 'development'){
  app.use(logger('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(compress());
}

var mongoStore = new MongoStore({
  db: db.connection.db
});

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: config.sessionSecret,
  store: mongoStore
}));

//app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(flash());
app.use(apassport.initialize());
app.use(apassport.session());

require('./routes/index.server.routes.js')(app);
require('./routes/stock.server.routes.js')(app);
require('./routes/reporting.server.routes.js')(app);

//app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
require('./config/socketio')(server, io, mongoStore);
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var passport = uPassport();

server.listen(3001);

module.exports = app;