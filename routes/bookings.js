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
router.get('/:id/checkin', auth.isManager, function(req,res) {
    var books = [];
    var flights = [];
    Booking.findOne(req.params.id, function (err, result1) {
        books.push(result1);

        Flight.queryOne(result1[0].flightID, function (err, flight1) {
            flights.push(flight1);

            if (result1[0].nextBook != null) {

                Booking.findOne(result1[0].nextBook, function (err, result2) {
                    books.push(result2);

                    Flight.queryOne(result2[0].flightID, function (err, flight2) {
                        flights.push(flight2);

                        if (result2[0].nextBook != null) {

                            Booking.findOne(result2[0].nextBook, function (err, result3) {
                                books.push(result3);
                                Flight.queryOne(result3[0].flightID, function (err,flight3) {
                                    flights.push(flight3);
                                    console.log(flights);
                                    console.log("test3");
                                    res.render('check', {shouldDisplayLogin: 2, result: books,flights:flights});
                                });
                            });
                        }

                        else {
                            console.log(flights);
                            console.log(result2[0].flightID);
                            console.log("test2");
                            res.render('check', {shouldDisplayLogin: 2, result: books,flights:flights});
                        }
                    });
                });
            }
            else {
                console.log(flights);
                console.log("test1");
                res.render('check', {shouldDisplayLogin: 2, result: books,flights:flights});
            }
        });
    });
});

router.delete('/:id', auth.isManager, function(req,res) {
    Booking.delete(req.params.id,function (err) {
        return true;
    });

});
module.exports = router;
