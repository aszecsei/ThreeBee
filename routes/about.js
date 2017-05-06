/**
 * Created by Tanner on 4/23/2017.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('about', {shouldDisplayLogin: (req.isAuthenticated() ? 1 : 0), loggedInName: (req.isAuthenticated() ? req.user.first_name + " " + req.user.last_name : null)});
});

module.exports = router;