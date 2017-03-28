'use strict';

var express = require('express');
var router = express.Router();
var Plane = require('../src/models/plane');
var Flight = require('../src/models/flight');

router.get('/', function(req, res) {
    Plane.query(function (err,rower) {
        if (rower == undefined){
            rower = new Array();
        }
        res.render('planes', {shouldDisplayLogin: 2, result: rower});
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

            });
            res.redirect("/planes")
        }
    });
});

router.get('/:id/delete', function(req,res){
    console.log(req.params.id);
    Plane.delete(req.params.id, function() {
        Flight.deletePlane(req.params.id, function () {
            res.redirect("/planes");
        });
    });
});
router.get('/:id', function(req,res){
    console.log("hello");
    Flight.queryOne(req.params.id, function (err,row) {
        if (row == undefined){
            row = new Array();
        }

        Plane.queryOne(req.params.id, function (err,rower) {
            console.log(rower);
            if (rower == undefined){
                res.redirect("/error");
            }
            res.render('planeInfo', {shouldDisplayLogin: 2, result: row, planes: rower});
        })
    });
});

module.exports = router;