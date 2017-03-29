'use strict';
var express = require('express');
var router = express.Router();

var auth = require('../src/auth');

var db = require('../src/database');

/* GET home page. */
router.get('/', function(req, res) {
  if(req.isAuthenticated()) { // check if we're logged in
      if (req.user.user_type == 1 && req.user.auth_status == 0) {
          res.redirect('/user/changepassword');
          return;
      }
  }

  if(req.isAuthenticated() && req.user.user_type == 2 && req.user.auth_status == 1) {
      // Get list of managers
      console.log("1");
      db.query("SELECT * FROM `USERS` WHERE `user_type`=1", function(err, rows) {
          console.log("2");
          var mManagers = [];
          if(rows) {
              console.log("3");
              for (var i = 0; i < rows.length; i++) {
                  mManagers.push({id: rows[i].user_id, email: rows[i].email, auth_status: (rows[i].auth_status == 0) ? "Unauthorized" : "Authorized"});
              }
          }
          console.log("4");
          res.render('admindashboard', {title: 'ThreeBee', shouldDisplayLogin: 1, managerList: mManagers});
      });

  } else if(req.isAuthenticated() && req.user.user_type == 1) {
    res.render('managerdashboard', {title: 'ThreeBee', shouldDisplayLogin: 1});
  } else {
      res.render('index', {
          title: 'ThreeBee',
          body: 'We be three bees! Alic, Emma, and Tanner.',
          shouldDisplayLogin: (req.isAuthenticated() ? 1 : 0)
      });
  }
});

module.exports = router;
