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
    console.log('we are in the update POST');
    var flight = new Flight();

    console.log('we are updating the flight from flights.js');
    //flight.planeID = req.body.editflight.editplaneID;
    console.log(JSON.stringify(req.params));
    console.log('editPlaneID: '+req.body.editplaneID);
    console.log('editPlaneID: '+req.params.editplaneID);
    flight.firstFlight = req.params.firstName;
    console.log('editFirstStop: '+req.params.editFirstStop);
    flight.turnover = req.params.lastName;
    console.log('editSecondStop: '+req.params.editSecondStop);
    flight.takeoff = req.params.takeoff;
    console.log('editDepartDate: '+ req.params.editDepartDate);
    flight.landing = req.params.landing;
    console.log('editArriveDate: '+req.params.editArriveDate);
    flight.basePrice = req.params.editBasePrice;
    console.log('editBasePrice: '+req.params.editBasePrice);
    flight.id = req.params.id;
    console.log('id: '+ req.params.id);

    /*
    Flight.queryOne(req.params.id, function(err, result) {
        console.log('we are in the query one');
        if(err) {
            console.log(err);
            throw err;
        } else if (result) {

            flight.updateFlight( function(err) {
                console.log('we are attempting to update the flight..');
               if(err){
                   console.log(err);
                   throw err;
               } else {
                   console.log('Apparently the update flight was a success...');
                   res.json({message: 'Successfully update flight info'});
               }
            });

        } else{
            console.log('we didn\'t find that flight with id: '+req.params.id);
        }


    });
    */
});

module.exports = router;