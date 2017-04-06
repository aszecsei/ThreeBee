'use strict';

var express = require('express');
var router = express.Router();
var Plane = require('../src/models/plane');
var auth = require('../src/auth');

router.post('/addplane', auth.isManager, function(req, res) {
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
                newPlane.id = id;
                res.json(newPlane);
            });
        }
    });
});

router.delete('/:id', auth.isManager, function(req,res){
    console.log(req.params.id);
    Plane.delete(req.params.id);
    res.json({message: 'Successfully deleted'});
});


module.exports = router;