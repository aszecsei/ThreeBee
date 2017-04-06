'use strict';
var express = require('express');
var router = express.Router();

var auth = require('../src/auth');

var db = require('../src/database');
var Plane = require('../src/models/plane');
var Flight = require('../src/models/flight');

var async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
  if(req.isAuthenticated()) { // check if we're logged in
      if (req.user.user_type == 1 && req.user.auth_status == 0) {
          res.redirect('/user/changepassword');
          return;
      }
  }

  if(req.isAuthenticated() && req.user.user_type == 2 && req.user.auth_status == 1) {
      async.parallel([getManagers, getPlanes, getFlights], function(err, results) {
          var combinedResult = {};
          for(var i = 0; i < results.length; i++) {
              combinedResult.managers = combinedResult.managers || results[i].managers;
              combinedResult.planes = combinedResult.planes || results[i].planes;
              combinedResult.flights = combinedResult.flights || results[i].flights;
          }
          res.render('admindashboard', {title: 'ThreeBee', shouldDisplayLogin: 1, managerList: combinedResult.managers, planes:combinedResult.planes, flights:combinedResult.flights});
      });
  } else if(req.isAuthenticated() && req.user.user_type == 1) {
    res.render('managerdashboard', {title: 'ThreeBee', shouldDisplayLogin: 1});
  } else {
      db.query("SELECT * FROM `airports`", function(err, rows) {
          if(!rows) {
              rows = [];
          }
          res.render('index', {
              title: 'ThreeBee',
              body: 'We be three bees! Alic, Emma, and Tanner.',
              shouldDisplayLogin: (req.isAuthenticated() ? 1 : 0),
              airports: rows
          });
      });
  }
});

function getManagers(callback) {
    var interimResult = {};
    db.query("SELECT * FROM `USERS` WHERE `user_type`=1 AND `deleted`=0", function(err, rows) {
        var mManagers = [];
        if (rows) {
            for (var i = 0; i < rows.length; i++) {
                mManagers.push({
                    id: rows[i].user_id,
                    email: rows[i].email,
                    auth_status: (rows[i].auth_status == 0) ? "Unauthorized" : "Authorized"
                });
            }
        }
        interimResult.managers = mManagers;
        callback(null, interimResult);
    });
}

function getPlanes(callback) {
    var interimResult = {};
    Plane.query(function (err,rows) {
        if(rows == undefined) {
            rows = [];
        }
        interimResult.planes = rows;
        callback(null, interimResult);
    });
}

function getFlights(callback) {
    var interimResult = {};
    Flight.query(function(err, rows) {
        if(rows == undefined) {
            rows = [];
        }
        interimResult.flights = rows;
        callback(null, interimResult);
    });
}

module.exports = router;
