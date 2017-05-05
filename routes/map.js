/**
 * Created by Tanner on 4/16/2017.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var rower = [[{lat: 33, lon: 44}, {lat: 2, lon: 14}]];
    console.log(rower[0][0].lon);
    res.render('map', {shouldDisplayLogin: (req.isAuthenticated() ? 1 : 0), result: rower, loggedInName: (req.isAuthenticated() ? req.user.first_name + " " + req.user.last_name : null)});
});

module.exports = router;
