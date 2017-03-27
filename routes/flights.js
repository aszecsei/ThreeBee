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
        if (row == undefined){
            row = new Array();
        }
        Plane.query(function (err,rower) {
            if (rower == undefined){
                rower = new Array();
            }
            res.render('flights', {shouldDisplayLogin: 2, result: row, planes: rower});
        })
    });
});

router.post('/:id/newflight/addflight', function(req, res) {
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
            newFlight.planeID = req.params.id;
            newFlight.takeoff = req.body.firstStop;
            newFlight.landing = req.body.secondStop;

            // save the user
            newFlight.save(function (err, id) {
                if (err) {
                    console.log(err);
                    throw err;
                }

            });
            res.redirect("/flights");
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
router.get('/:id/delete', function(req,res){
    console.log(req.params.id);
    Flight.delete(req.params.id);
    res.redirect("/flights");
});

router.get('/:id/newflight', function (req,res) {
    res.render('newFlight',{ shouldDisplayLogin: 2});
});


module.exports = router;