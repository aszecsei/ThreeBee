var express = require('express');
var router = express.Router();

var Flight = require('../src/models/flight');

var PDFDocument = require ('pdfkit');
var email = require('../src/email');
var async = require('async');
var Booking = require('../src/models/booking');

var errorHandle = function(res, message) {
    console.log("ERROR: " + JSON.stringify(message));
    res.status(500).json(message);
};

router.post('/', function (req,res) {
    // TODO: Get the booking information and stuff
    // This is the previous way we booked things; I moved it out here for your reference.
    // Some of it (like rendering the second flight search page) can be entirely ignored.
    var flights = JSON.parse(req.body.booking_flights);
    console.log('we are opening up the purchase options');

    //query the database for the flights and grab the price
    Flight.findPrices(flights, function (err, result) {
        if (err) {
            console.log(err);
            throw err;
        } else if (result.length > 0) {
            var priceTotal = 0;
            for(var i =0; i < result.length; i++){
                priceTotal += result[i].flight_basePrice;
                console.log(priceTotal);
            }
            res.render('purchaseoptions', {
                shouldDisplayLogin: 2,
                cost: priceTotal,
                flights: JSON.stringify(flights)
            });
        }
    });

});

//this is where the user can input their card information
router.post('/submitoptions', function(req,res) {
    console.log('were submitting optionssss');



    var totalBasePrice = parseInt(req.body.totalBasePrice);
    console.log(req.body.totalBasePrice);
    console.log(totalBasePrice);
    var numTickets = parseInt(req.body.numTickets);
    console.log(numTickets);
    var tierIndex = req.body.tier;

    Flight.getModifier(tierIndex, function(err, result){
        if(err){
            console.log(err);
            throw err;
        } else {
            console.log('found the modifier! : '+result[0].modifier);
            console.log('result: '+JSON.stringify(result));
            var modVal = parseInt(result[0].modifier);
            var totalPrice = totalBasePrice*modVal*numTickets;
            console.log('totalPrice: '+totalPrice);

            res.render('payment', {
                shouldDisplayLogin: 2,
                cost: totalPrice,
                flights: req.body.flights
            });
        }
    });
});

//this is where the receipt generation will happen
router.post('/confirm', function (req,res) {
    console.log('we confirmed the purchase..');

    //receipt generation
    //var PDF = new PDFDocument();
    var price = req.body.cost;
    console.log(req.body);
    console.log(price);
    //addToPDF(price,PDF);
    //PDF.end();
    console.log('user info: '+req.user.email);

    var flights = JSON.parse(req.body.flights);
    console.log("FLIGHTS: " + JSON.stringify(flights));
    async.each(flights, function(booking, callback) {
        console.log("Booking: " + JSON.stringify(booking));
        var newBook = new Booking();
        console.log("Test ID");
        newBook.userID =req.user.id;
        console.log("Test post-ID");
        newBook.type = 1;
        console.log("Booking length: " + booking.length);
        switch (booking.length){
            case 1:
                newBook.flightID = booking[0];
                newBook.lastId = null;
                console.log("Saving...");
                newBook.save(function(err) {
                    console.log("SAVED");
                    callback(err);
                });
                break;
            case 2:
                newBook.flightID = booking[1];
                newBook.lastId = null;
                newBook.save(function (err,test){
                    if (err) {
                        callback(err);
                    } else {
                        newBook.flightID = booking[0];
                        newBook.lastId = test;
                        newBook.save(callback);
                    }
                });
                break;
            case 3:
                newBook.flightID = booking[2];
                newBook.lastId = null;
                newBook.save(function (err,id1) {
                    if (err) {
                        callback(err);
                    } else {
                        newBook.flightID = booking[1];
                        newBook.lastId = id1;
                        newBook.save(function (err, id2) {
                            if (err) {
                                callback(err);
                            } else {
                                newBook.flightID = booking[0];
                                newBook.lastId = id2;
                                newBook.save(callback);
                            }
                        });
                    }
                });
                break;
        }
    }, function(err) {
        console.log("Bookings done");
        if(err) {
            errorHandle(res, err);
        } else {
            console.log("Going to email!");
            email.sendMail(req.user.email, "Booked Flight", "Congratulations on your booked trip\n\nAmount Paid: $"+price, function () {
                console.log("Email sent!");
                res.json({message: 'Successfully booked!'});
            });
        }
    });
});

module.exports = router;