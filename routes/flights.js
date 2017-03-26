/**
 * Created by Tanner on 3/16/2017.
 */
'use strict';

var express = require('express');
var router = express.Router();
var Flight = require('../src/models/flight');
var Plane = require('../src/models/plane')

router.get('/', function(req, res, next) {
    Flight.query(function (err,row) {
        Plane.query(function (err,rower) {
            res.render('flights', {shouldDisplayLogin: 2, result: row, planes: rower});
        })
    });
});

router.post('/addflight', function(req, res) {
    Flight.findOne({'name': req.body.addname}, function (err, plane) {
        // if there are any errors, return the error
        if (err)
            res.status(400);

        // check to see if theres already a user with that email
        if (plane) {
            res.status(400);
        } else {
            // if there is no user with that email
            // create the user
            var newFlight = new Flight();

            // set the user's local credentials
            newFlight.duration = req.body.duration;
            newFlight.firstFlight = req.body.dateTime;
            newFlight.turnover = req.body.turnover;
            newFlight.planeID = req.body.planeID;
            newFlight.takeoff = req.body.firstStop;
            newFlight.landing = req.body.secondStop;

            // save the user
            newFlight.save(function (err, id) {
                if (err) {
                    console.log(err);
                    throw err;
                }

            });
        }
    });
});


router.post('/removeplane', function(req, res){

    Flight.findOne({'name': req.body.rename}, function (err, plane) {
        if (err)
            res.status(400);
        // if there are any errors, return the error

        // check to see if theres already a user with that email

        Plane.delete(req.body.rename)

    });

});


module.exports = router;