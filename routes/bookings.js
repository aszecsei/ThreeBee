'use strict';
var express = require('express');
var router = express.Router();

var passport = require('passport');
var auth = require('../src/auth');
var db = require('../src/database');
var Booking = require('../src/models/booking');
router.get('/', function(req, res) {
    Booking.findHead(function (err, row) {
        var toPass = [];
        for (var i = 0; i < row.length; i++) {
            if (row[i].nextBook != 0) {
                Booking.findOne(row[i].nextBook, function (err, row2) {
                    if (row2[0].nextBook != 0) {
                        Booking.findOne(row2[0].nextBook, function (err, row3) {
                            toPass[i] = [row[i], row2[0], row3[0]];
                            res.render('booking', {shouldDisplayLogin: 2, result: toPass});
                        });
                    }
                    else {
                        toPass[i] = [row[i], row2[0]];
                        res.render('booking', {shouldDisplayLogin: 2, result: toPass});
                    }
                });
            }
            else {
                toPass[i] = [row[i]];
                res.render('booking', {shouldDisplayLogin: 2, result: toPass});
            }
        }
    });
});
