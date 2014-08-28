var express = require('express');
var router = express.Router();

module.exports = function (passport) {

  var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/login');
  }

  /* GET home page. */
  router.get('/', isAuthenticated, function(req, res) {
    //res.render('index', { title: 'Express' });
    res.send(":D!");
  });

  router.get('/login', function(req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/');
    }
    res.render('login');
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  router.post('/login', function (req, res, next) {

    passport.authenticate('local',
    function (err, user, info) {
      if(err) {
        return next(err);
      }
      if(!user){
        return res.redirect('/login');
      }

      req.logIn(user, function (err) {
        if(err) {
          return next(err);
        }
        return res.redirect('/');
      });
    })(req, res, next);

  });

  return router;

}
