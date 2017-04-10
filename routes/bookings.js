'use strict';
var express = require('express');
var router = express.Router();

var passport = require('passport');
var auth = require('../src/auth');
var db = require('../src/database');
var Booking = require('../src/models/booking');
var Flight = require('../src/models/flight')
router.get('/', function(req, res) {
    console.log("Test In");
    var toPass = [];
    Booking.findHead(req.passport.user.id, function(err, row) {
        console.log("Test 1");
        for (var i = 0; i < row.length; i++) {
            console.log(i);
            if (row[i].nextBook != 0) {
                console.log(i);
                console.log((row[i].nextBook));
                var j = i
                Booking.findOne(row[i].nextBook, function (err, row2) {
                    console.log("j = " + j);
                    if (row2[0].nextBook != 0) {
                        console.log(i);
                        console.log("Test 3");
                        Booking.findOne(row2[j].nextBook, function (err, row3) {
                            toPass[j] = [row[j], row2[0], row3[0]]

                    }
                    else {
                        toPass[j] = [row[i], row2[0]];
                    }
                }
            }
            else {
                toPass[i] = [row[i-1]];

            }
        }
    }
    console.log(toPass)
    var toSend = [];
    for(var r =0; r < toPass.length; r++){
        for(var l = 0; l<toPass[l].length; i++){

            Flight.findById(toPass[r][l].flightID, function (err, result) {
                toSend[r][l] = result;
            });
        }
    }
    res.render('bookingInfo', {shouldDisplayLogin: 2, result: toSend});

});

});
module.exports = router;
