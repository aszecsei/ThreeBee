'use strict';

var express = require('express');
var router = express.Router();
var Plane = require('../src/models/plane');

router.get('/', function(req, res, next) {
    res.render('planes', {shouldDisplayLogin: 2});
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
        }
    });
});

router.post('/removeplane', function(req, res){

    Plane.findOne({'name': req.body.rename}, function (err, plane) {
        if (err)
            res.status(400);
        // if there are any errors, return the error
        if (err)
            res.status(400);

        // check to see if theres already a user with that email

            Plane.delete(req.body.rename)

    });

});


module.exports = router;