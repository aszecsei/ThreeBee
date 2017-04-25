'use strict';
var express = require('express');
var router = express.Router();

var passport = require('passport');
var auth = require('../src/auth');
var db = require('../src/database');
var Booking = require('../src/models/booking');
var Flight = require('../src/models/flight');
var async = require('async');

router.get('/', auth.isLoggedIn, function(req, res) {
    console.log("here");
    console.log(req.user.id);
    if(req.isAuthenticated() && req.user.user_type == 2 && req.user.auth_status == 1){
        Booking.getAll(function (err, result) {
            res.render('managerbookings', {shouldDisplayLogin: 2, result: result, loggedInName: "Admin"});

        })
    } else if(req.isAuthenticated() && req.user.user_type == 1){
            Booking.getAll(function (err, result) {
                res.render('managerbookings', {shouldDisplayLogin: 2, result: result, loggedInName: "Admin"});

            })
    } else {
        Booking.getAllForUser(req.user.id, function(err, results) {
            console.log(results);
            res.render('bookingInfo', {shouldDisplayLogin: 2, result: results});
        });
    }
});

router.post('/:id', function (req,res) {
    db.query("UPDATE `threebee`.`flight_data` SET `flight_isActive`='0' WHERE planeID = '" +req.params.id+"';");
    res.redirect('/');
});
module.exports = router;
