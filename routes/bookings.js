'use strict';
var express = require('express');
var router = express.Router();

var passport = require('passport');
var auth = require('../src/auth');
var Booking = require('../src/models/booking');
var Flight = require('../src/models/flight');
var async = require('async');
var moment = require('moment');
var PDFDocument = require ('pdfkit');

router.get('/', auth.isLoggedIn, function(req, res) {

    if((req.isAuthenticated() && req.user.user_type == 2 && req.user.auth_status == 1) ||
        (req.isAuthenticated() && req.user.user_type == 1)) {
        Booking.getAll(function (err, result) {
            async.map(result, function(trip, callback) {
                async.map(trip, function(booking, callback2) {
                    Flight.queryOne(booking.flightID, function(err, flight) {
                        booking.planeName = flight.planeName;
                        booking.takeoff = flight.takeoff;
                        booking.takeoffAbbr = flight.takeoffAbbr;
                        booking.landing = flight.landing;
                        booking.landingAbbr = flight.landingAbbr;
                        var departureTime = moment(flight.flight_firstFlight);
                        booking.departureTime = departureTime.format("LLL");
                        booking.arrivalTime = departureTime.add(flight.flight_duration, 'minutes').format("LLL");
                        callback2(err, booking);
                    });
                }, function(err, newTrip) {
                    callback(err, newTrip);
                });
            }, function(err, trips) {
                res.render('managerbookings', {shouldDisplayLogin: 2, result: trips, loggedInName: (req.isAuthenticated() ? req.user.first_name + " " + req.user.last_name : null)});
            });
        });
    } else {
        var nowDate = moment();
        var canDelete = true;
        Booking.getAllForUser(req.user.id, function(err, results) {
            async.map(results, function(trip, callback) {
                async.map(trip, function(booking, callback2) {
                    Flight.queryOne(booking.flightID, function(err, flight) {
                        booking.planeName = flight.planeName;
                        booking.takeoff = flight.takeoff;
                        booking.takeoffAbbr = flight.takeoffAbbr;
                        booking.landing = flight.landing;
                        booking.landingAbbr = flight.landingAbbr;
                        var departureTime = moment(flight.flight_firstFlight);
                        var beforeDate = moment(departureTime).add(1, 'd');
                        if (beforeDate.isBefore(nowDate)){
                            booking.canDelete = false;
                        }
                        booking.departureTime = departureTime.format("LLL");
                        booking.arrivalTime = departureTime.add(flight.flight_duration, 'minutes').format("LLL");
                        booking.canDelete = canDelete;
                        callback2(err, booking);
                    });
                }, function(err, newTrip) {
                    callback(err, newTrip);
                });
            }, function(err, trips) {
                res.render('bookingInfo', {shouldDisplayLogin: 2, result: results, loggedInName: (req.isAuthenticated() ? req.user.first_name + " " + req.user.last_name : null)});
            });
        });
    }
});
router.get('/:id/checkin', auth.isManager, function(req,res) {
    Booking.findOne(req.params.id, function (err, result1) {
        if (result1[0].nextBook != null) {
            Booking.findOne(result1[0].nextBook, function (err, result2) {
                if (result2[0].nextBook != null) {
                    Booking.findOne(result2[0].nextBook, function (err, result3) {
                        console.log("test3");
                        res.render('seats', {shouldDisplayLogin: 2 ,flights: 3, loggedInName: "Manager"});
                    });
                }
                else {
                    console.log("test2");
                    res.render('seats', {shouldDisplayLogin: 2 ,flights: 2, loggedInName: "Manager"});
                }
            });
        }
        else {
            console.log("test1");
            res.render('seats', {shouldDisplayLogin: 2 ,flights: 1, loggedInName: "Manager"});
        }
    });
});

router.post('/:id/checkin', auth.isManager, function(req,res) {
    var PDF = new PDFDocument();
    PDF.pipe(res);
    var books = [];
    var flights = [];
    Booking.findOne(req.params.id, function (err, result1) {
        books.push(result1);

        Flight.queryOne(result1[0].flightID, function (err, flight1) {
            addToPDF(flight1,result1,req.body.seat1,req.body.luggage1, PDF);
            flights.push(flight1);

            if (result1[0].nextBook != null) {

                Booking.findOne(result1[0].nextBook, function (err, result2) {
                    books.push(result2);

                    Flight.queryOne(result2[0].flightID, function (err, flight2) {
                        PDF.addPage();
                        addToPDF(flight2,result2,req.body.seat2,req.body.luggage2,PDF);
                        flights.push(flight2);

                        if (result2[0].nextBook != null) {

                            Booking.findOne(result2[0].nextBook, function (err, result3) {
                                books.push(result3);
                                Flight.queryOne(result3[0].flightID, function (err,flight3){
                                    PDF.addPage();
                                    addToPDF(flight3,result3,req.body.seat3,req.body.luggage3,PDF);
                                    flights.push(flight3);
                                    PDF.end();
                                });
                            });
                        }

                        else {
                            console.log(flights);
                            console.log(result2[0].flightID);
                            console.log("test2");
                            PDF.end();
                        }
                    });
                });
            }
            else {
                console.log(flights);
                console.log("test1");
                PDF.end();
            }
        });
    });
});


router.delete('/:id', function(req,res) {
    Booking.delete(req.params.id,function (err) {
        return true;
    });
});

function addToPDF(flightresult,bookingresult, seat, bags, PDF) {
    var bookClass;
    switch (bookingresult[0].bookingType){
        case 1:
            bookClass = "Economy Class";
            break;
        case 2:
            bookClass = "Business Class";
            break;

        case 3:
            bookClass = "First Class";
            break;


    }


    PDF.fontSize(25)
        .image('./public/images/threebee-logo_airlines.png', 100, 160)
        .text('This is your ticket', 100, 100)


    PDF.fontSize(10)
        .text('Takeoff: ' + flightresult.takeoff + ' Landing: '+ flightresult.landing)
        .text('Departure: '+ moment(flightresult.flight_firstFlight).format("LLL") + '  Arrival: '+ moment(flightresult.flight_firstFlight).add(flightresult.flight_duration, "minutes").format("LLL"))
        .text('Plane: ' + flightresult.planeName +' Booking Class: ' + bookClass + ' Seat:'+ seat + ' Number of Bags: '+bags);
}
module.exports = router;