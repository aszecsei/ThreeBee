'use strict';
var express = require('express');
var router = express.Router();

var passport = require('passport');
var auth = require('../src/auth');
var db = require('../src/database');
var Booking = require('../src/models/booking');
var Flight = require('../src/models/flight');
var async = require('async');
var moment = require('moment');

router.get('/', auth.isLoggedIn, function(req, res) {
    console.log("here");
    console.log(req.user.id);
    if((req.isAuthenticated() && req.user.user_type == 2 && req.user.auth_status == 1) ||
        (req.isAuthenticated() && req.user.user_type == 1)) {
        Booking.getAll(function (err, result) {
            console.log("Bookings: " + JSON.stringify(result, null, 4));
            async.map(result, function(trip, callback) {
                async.map(trip, function(booking, callback2) {
                    Flight.queryOne(booking.flightID, function(err, flight) {
                        console.log("Flight #" + booking.flightID + ": " + JSON.stringify(flight, null, 4));
                        booking.planeName = flight.planeName;
                        booking.takeoff = flight.takeoff;
                        booking.takeoffAbbr = flight.takeoffAbbr;
                        booking.landing = flight.landing;
                        booking.landingAbbr = flight.landingAbbr;
                        var departureTime = new Date(flight.flight_firstFlight);
                        departureTime = moment(departureTime);
                        booking.departureTime = departureTime.format("LLL");
                        booking.arrivalTime = departureTime.add(flight.flight_duration, 'minutes').format("LLL");
                        callback2(err, booking);
                    });
                }, function(err, newTrip) {
                    callback(err, newTrip);
                });
            }, function(err, trips) {
                console.log(JSON.stringify(trips, null, 4));
                res.render('managerbookings', {shouldDisplayLogin: 2, result: trips});
            });
        });
    } else {
        Booking.getAllForUser(req.user.id, function(err, results) {
            console.log(results);
            res.render('bookingInfo', {shouldDisplayLogin: 2, result: results});
        });
    }
});

module.exports = router;
