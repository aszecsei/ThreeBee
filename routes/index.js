'use strict';
var express = require('express');
var router = express.Router();

var auth = require('../src/auth');

/* GET home page. */
router.get('/', function(req, res) {
  if(req.isAuthenticated()) { // check if we're logged in
      if (req.user.user_type == 1 && req.user.auth_status == 0) {
          res.redirect('/user/changepassword');
          return;
      }
  }

  if(req.isAuthenticated() && req.user.user_type == 2 && req.user.auth_status == 1) {
    res.render('admindashboard', {title: 'ThreeBee', shouldDisplayLogin: 1});
  } else if(req.isAuthenticated() && req.user.user_type == 1) {
    res.render('index', {title: 'ThreeBee', shouldDisplayLogin: 1}); // TODO: Change this if we have a manager portal
  } else {
      res.render('index', {
          title: 'ThreeBee',
          body: 'We be three bees! Alic, Emma, and Tanner.',
          shouldDisplayLogin: (req.isAuthenticated() ? 1 : 0)
      });
  }
});

module.exports = router;
