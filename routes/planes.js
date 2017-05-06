'use strict';

var express = require('express');
var router = express.Router();
var Plane = require('../src/models/plane');
var auth = require('../src/auth');
var Flight = require('../src/models/flight');


router.get('/', function(req, res) {
    Plane.query(function (err,rower) {
        if (rower == undefined){
            rower = [];
        }
        res.render('planes', {shouldDisplayLogin: 2, result: rower, loggedInName: (req.isAuthenticated() ? req.user.first_name + " " + req.user.last_name : null)});
    });
});

router.post('/addplane', function(req, res) {
    Plane.findOne({'name': req.body.addname}, function (err, plane) {
        // if there are any errors, return the error
        if (err)
            res.status(400);

        // check to see if theres already a user with that email
        if (plane) {
            res.status(400);
        } else {
            // if there is no user with that email
            // create the user
            var newPlane = new Plane();

            // set the user's local credentials
            newPlane.name = req.body.addname;
            newPlane.numBizSeat = req.body.numBizSeat;
            newPlane.numCoachSeat = req.body.numCoachSeat;
            newPlane.numFirstSeat = req.body.numFirstSeat;

            // save the user
            newPlane.save(function (err, id) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                newPlane.mId = id;
                res.json(newPlane);
            });

        }
    });
});

router.delete('/:id', auth.isManager, function(req,res) {
    console.log(req.params.id);
    Plane.delete(req.params.id, function() {
        res.json({message: 'Successfully deleted'});
    });
});

router.get('/:id', function(req,res){
    console.log("hello");
    Flight.queryOne(req.params.id, function (err,row) {
        if (row == undefined){
            row = [];
        }

        Plane.queryOne(req.params.id, function (err,rower) {
            console.log(rower);
            if (rower == undefined){
                res.redirect("/planes");
            }
            res.render('planeInfo', {shouldDisplayLogin: 2, result: row, planes: rower, loggedInName: (req.isAuthenticated() ? req.user.first_name + " " + req.user.last_name : null)});
        })
    });

});
router.get('/:id/newflight', function (req,res) {
    res.render('newFlight',{ shouldDisplayLogin: 2, loggedInName: (req.isAuthenticated() ? req.user.first_name + " " + req.user.last_name : null)});
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
                res.redirect("/flights");
            });

        }
    });
});

router.post('/editplane/:id', function(req, res) {
    console.log('we are in the edit plane post request.');
    console.log( req.body.original_name);
    Plane.findPlaneForEdit( req.body.original_name, function(err, plane) {
        if(err) {
            res.status(400);
        } else if(plane) {
            var updatedPlane = new Plane();

            //set the local credentials
            updatedPlane.id=plane.id;
            updatedPlane.name = req.body.editname;
            updatedPlane.numFirstSeat = req.body.editNumFirstSeat;
            updatedPlane.numBizSeat = req.body.editNumBizSeat;
            updatedPlane.numCoachSeat = req.body.editNumCoachSeat;

            updatedPlane.update(function (err, id) {
                if (err) {
                    console.log(err);
                    throw err;
                }else {
                    res.json({message: 'Successfully update flight info'});
                }
            })
        }
    });


});


module.exports = router;