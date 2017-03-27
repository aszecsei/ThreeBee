'use strict';
var express = require('express');
var router = express.Router();

/* GET signup page. */
router.get('/', function(req, res) {
    res.render('registrationsuccess', {shouldDisplayLogin: 2});
});

module.exports = router;