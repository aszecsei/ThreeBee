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
        newFlight.basePrice = req.body.basePrice;
        console.log("SAVING: " + JSON.stringify(newFlight));

        // save the user
        newFlight.save(function (err, id) {
            if (err) {
                callback(err);
                return;
            }
            console.log("SAVED");
            newFlight.id = id;
            Flight.queryOne(id, function(err, result) {
                var departureTime = new Date(result.flight_firstFlight);
                departureTime = moment(departureTime);
                result.departureTime = departureTime.format("LLL");
                result.arrivalTime = departureTime.add(result.flight_duration, 'minutes').format("LLL");
                callback(err, result);
            });
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

//updates the flight information
router.post('/:id', auth.isManager, function(req,res) {
    var updateFlight = new Flight();

    updateFlight.id = req.body.editflight_id;
    updateFlight.duration = req.body.editduration;
    updateFlight.firstFlight = req.body.editdateTime;
    updateFlight.turnover = req.body.editturnover;
    updateFlight.planeID = req.body.planeID;
    updateFlight.takeoff =req.body.editfirstStop;
    updateFlight.landing = req.body.editsecondStop;
    updateFlight.basePrice = req.body.editbasePrice;

    updateFlight.updateFlight( function(err) {
        if(err){
            console.log(err);
            throw err;
        } else {
            res.json({message: 'Successfully update flight info', loggedInName: (req.isAuthenticated() ? req.user.first_name + " " + req.user.last_name : null)});
        }
    });



});

module.exports = router;