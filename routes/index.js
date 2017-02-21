'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ThreeBee', body: 'We be three bees! Alic, Emma, and Tanner.', shouldDisplayLogin: true });
});

module.exports = router;
