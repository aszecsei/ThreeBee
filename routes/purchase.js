var express = require('express');
var router = express.Router();

var Flight = require('../src/models/flight');

router.post('/', function (req,res) {
    // TODO: Get the booking information and stuff
    // This is the previous way we booked things; I moved it out here for your reference.
    // Some of it (like rendering the second flight search page) can be entirely ignored.
    var flights = JSON.parse(req.body.booking_flights);
    console.log(flights.length);
    console.log(flights[0]);
    console.log(flights[1]);
    console.log('where the fuck are we?');

    //query the database for the flights and grab the price
    Flight.findPrices(flights, function (err, result) {
        console.log('we are querying');
        if (err) {
            console.log(err);
            throw err;
        } else if (result.length > 0) {
            console.log('we found that shit');
            var priceTotal = 0;
            for(var i =0; i < result.length; i++){
                priceTotal += result[i].flight_basePrice;
                console.log(priceTotal);
            }
            console.log('we are about to render the page');
            res.render('purchaseoptions', {
                shouldDisplayLogin: 2,
                cost: priceTotal
            });
        }
    });

});

//this is where the user can input their card information
router.post('/submitoptions', function(req,res) {
    console.log('were submitting optionssss');

    //calculating the price
    //var flightNumbers = req.body.flights;


    res.render('payment', {
        shouldDisplayLogin: 2
        //cost: cost
    });


});

//this is where the receipt generation will happen
router.post('/confirm', function (req,res) {
    console.log('we confirmed? the purchase..');
    /*
     var flights = JSON.parse(req.body.booking_flights)
     var newBook = new Booking();
     newBook.userID =req.user.id;
     console.log("Past");

     var flightType = req.body.flightType;

     var returnDate = req.body.returndate;
     var fromCity = req.body.fromCity;
     var toCity = req.body.toCity;

     var sortType = req.body.sortType ? req.body.sortType : "STOPS";

     console.log(flightType);
     console.log(returnDate);
     console.log(fromCity);
     console.log(toCity);


     newBook.type = 1;

     switch (flights.length){
     case 1:
     newBook.flightID = flights[0];
     newBook.lastId = null;
     console.log("Test at 1");
     newBook.save(function (err) {
     if (err) {
     console.log(err);
     throw err;
     }
     if(flightType != "roundtrip")
     {
     res.render('payment', {shouldDisplayLogin: 2});
     }
     else {
     renderPage(fromCity,toCity,returnDate,0,req,res,0, sortType);
     }
     });
     break;
     case 2:
     newBook.flightID = flights[1];
     newBook.lastId = null;
     console.log("Test at 2");
     newBook.save(function (err,test){
     if (err) {
     console.log(err);
     throw err;
     }
     newBook.flightID = flights[0];
     newBook.lastId = test;
     newBook.save(function (err) {
     if (err) {
     console.log(err);
     throw err;
     }
     if(flightType != "roundtrip")
     {
     res.render('payment', {shouldDisplayLogin: 2});
     }
     else {
     renderPage(fromCity,toCity,returnDate,0,req,res,0, sortType);
     }
     });
     });
     break;
     case 3:
     newBook.flightID = flights[2];
     newBook.lastId = null;
     console.log("Test at 3");
     newBook.save(function (err,id1) {
     if (err) {
     console.log(err);
     throw err;
     }
     newBook.flightID = flights[1];
     newBook.lastId = id1;
     newBook.save(function (err,id2) {
     if (err) {
     console.log(err);
     throw err;
     }
     newBook.flightID = flights[0];
     newBook.lastId = id2;
     newBook.save(function (err) {
     if (err) {
     console.log(err);
     throw err;
     }
     if(flightType != "roundtrip")
     {
     res.render('payment', {shouldDisplayLogin: 2});
     }
     else {
     renderPage(fromCity,toCity,returnDate,0,req,res,0, sortType)
     }
     });
     });
     });
     break;
     }
     });
     */


});

module.exports = router;