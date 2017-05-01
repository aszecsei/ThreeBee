/**
 * Created by Tanner on 3/16/2017.
 */
'use strict';

var express = require('express');
var router = express.Router();
var Flight = require('../src/models/flight');
var auth = require('../src/auth');
var moment = require('moment');
var async = require('async');

router.post('/', auth.isManager, function(req, res) {
    console.log("HI");
    var recurrence = req.body.recurrence;
    if(recurrence != "single") {
        var endDate = moment(req.body.endDate, "MM/DD/YYYY");
    } else {
        endDate = moment(req.body.dateTime);
    }

    var mRecur = "days";
    if(recurrence == "weekly") {
        mRecur = "weeks";
    } else if(recurrence == "monthly") {
        mRecur = "months";
    }

    // If you want an inclusive end date (fully-closed interval)
    var dates = [];
    for (var m = moment(req.body.dateTime); m.diff(endDate, 'days') <= 0; m.add(1, mRecur)) {
        dates.push(m.format("YYYY-MM-DD HH:mm:ss"));
    }

    console.log("DATES: " + JSON.stringify(dates));

    async.map(dates, function(date, callback) {
        var newFlight = new Flight();

        // set the user's local credentials
        newFlight.duration = req.body.duration;
        newFlight.firstFlight = date;
        newFlight.turnover = req.body.turnover;
        newFlight.planeID = req.body.planeID;
        newFlight.takeoff = req.body.firstStop;
        newFlight.landing = req.body.secondStop;
        console.log("SAVING: " + JSON.stringify(newFlight));

        // save the user
        newFlight.save(function (err, id) {
            if (err) {
                callback(err);
                return;
            }
            console.log("SAVED");
            newFlight.id = id;
            callback(err, newFlight);
        });
    }, function(err, addedFlights) {
        if(err) {
            console.log(err);
            res.json({"Error: " : err});
        } else {
            res.json(addedFlights);
        }
    });
});

router.delete('/:id', auth.isManager, function(req,res) {
    console.log(req.params.id);
    Flight.delete(req.params.id);
    res.json({message: 'Successfully deleted'});
});

module.exports = router;