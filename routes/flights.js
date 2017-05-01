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

        // check to see if there's already a user with that email
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
            res.json({message: 'Successfully update flight info'});
        }
    });



});

module.exports = router;