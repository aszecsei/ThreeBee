var express = require('express');
var router = express.Router();

var Flight = require('../src/models/flight');

var PDFDocument = require ('pdfkit');
var email = require('../src/email');

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
                cost: priceTotal
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
                cost: totalPrice
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


    email.sendMail(req.user.email, "Booked Flight", "Congratulations on your booked trip\n\nAmount Paid: $"+price, function () {
        res.json({message: 'Successfully registered'})
    });

    res.json({message: "Successfully confirmed"});
/*
     var flights = JSON.parse(req.body.booking_flights);
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
                         } else {
                            renderPage(fromCity,toCity,returnDate,0,req,res,0, sortType)
                         }
                     });
                 });
             });
             break;
         }

*/

});

module.exports = router;