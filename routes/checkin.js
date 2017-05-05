/**
 * Created by Tanner on 4/26/2017.
 */

var express = require('express');
var router = express.Router();
var auth = require('../src/auth');
var Booking = require('../src/models/booking');

router.get('/:id', auth.isManager, function(req,res) {
    var books = [];
    Booking.findOne(req.params.id, function (err, result1) {
        books.push(result1);
        if (result1 != null){
            Booking.findOne(result1[0].nextBook, function (err, result2) {
                books.push(result2);
                if (result1 != null){
                    Booking.findOne(result2[0].nextBook, function (err, result3) {
                        books.push(result3);
                        res.render('check', {shouldDisplayLogin: 2, result: books, loggedInName: (req.isAuthenticated() ? req.user.first_name + " " + req.user.last_name : null)});
                    });
                }
                else {
                    res.render('check', {shouldDisplayLogin: 2, result: books, loggedInName: (req.isAuthenticated() ? req.user.first_name + " " + req.user.last_name : null)});
                }
            });
        }
        else {
            res.render('check', {shouldDisplayLogin: 2, result: books, loggedInName: (req.isAuthenticated() ? req.user.first_name + " " + req.user.last_name : null)});
        }
    });
});


module.exports = router;