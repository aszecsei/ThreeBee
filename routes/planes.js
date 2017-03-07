'use strict';

var express = require('express');
var router = express.Router();

var passport = require('passport');

router.get('/', function(req, res, next) {
    res.render('planes', {shouldDisplayLogin: 2});
});

module.exports = router;