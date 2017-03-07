'use strict';

var express = require('express');
var router = express.Router();

var passport = require('passport');
var Plane = require(''../src/models/planes'')

router.get('/', function(req, res, next) {
    res.render('planes', {shouldDisplayLogin: 2});
});

router.post('/', function(req, res) {
    Plane.FindOne
});


module.exports = router;