var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var swig = require('swig');
var expressSession = require('express-session');

var DB = {
  users: [
    {id: 1, username: 'jams', password: '12345'},
    {id: 2, username: 'jams1', password: '12345'},
    {id: 3, username: 'jams2', password: '12345'}
  ]
};

passport.serializeUser(function (user, done) {
  console.log("serialize");
  console.log(user);
  return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("deserialize");
  console.log(id);
  var users = DB.users;
  for (var i = 0; i < users.length; i++) {
    var userId = users[i].id;
    if(userId == id){
      return done(null, users[i]);
    }
  }
  return done(new Error('Usuario no encontrado'));
});

passport.use(new LocalStrategy(
  { passReqToCallback: true },
  function (req, username, password, done) {
    process.nextTick(function () {
      // Busqueda de Usuario por Credenciales
      var users = DB.users;
      for (var i = 0; i < users.length; i++) {
        var username_ = users[i].username;
        var password_ = users[i].password;
        if(username == username_){
          if(password == password_){
            return done(null, users[i]);
          }else{
            return done(null, false, { message: 'Contraseña Incorrecta' });
          }
        }
      }
      return done(new Error('Usuario no encontrado'));
    });
  })
);

var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);
swig.setDefaults({ cache: false });
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(expressSession({secret: 'ABCD123'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index')(passport);
var users = require('./routes/users');

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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


module.exports = app;
