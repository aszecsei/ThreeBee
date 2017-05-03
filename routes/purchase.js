var express = require('express');
var router = express.Router();

router.post('/', function (req,res) {
    // TODO: Get the booking information and stuff
    // This is the previous way we booked things; I moved it out here for your reference.
    // Some of it (like rendering the second flight search page) can be entirely ignored.
    /*
     router.post('/book', function (req,res) {

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