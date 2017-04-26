/**
 * Created by Tanner on 3/16/2017.
 */
'use strict';

var express = require('express');
var router = express.Router();
var Flight = require('../src/models/flight');
var auth = require('../src/auth');

router.post('/', function(req, res) {
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
            newFlight.basePrice = req.body.basePrice;

            // save the user
            newFlight.save(function (err, id) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                newFlight.id = id;
                res.json(newFlight);
            });
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


    Flight.queryOne(req.params.id, function(err, result) {
        if(err) {
            errorHandle(res, err);
        } else if (result.length>0) {
            var flight = new Flight;
            result.duration = req.body.duaration;
            result.firstFlight = req.body.firstName;
            result.turnover = req.body.lastName;
            result.takeoff = req.body.takeoff;
            result.landing = req.body.landing;
            result.basePrice = req.body.basePrice;

            flight.updateFlight( function(err) {
               if(err){
                   errorHandle(err);
               } else {
                   res.json({message: 'Successfully update flight info'});
               }
            });

        }

    });
});

module.exports = router;