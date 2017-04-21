var express = require('express');
var router = express.Router();
var Flight = require('../src/models/flight');
var Booking = require('../src/models/booking');

var async = require('async');
var moment = require('moment');
var db = require('../src/database');

router.post('/book', function (req,res) {
    var flights = JSON.parse(req.body.booking_flights)
    var newBook = new Booking();
    newBook.userID =req.user.id;

    newBook.type = 1;
    console.log("Test Here");
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
                res.render('payment', {shouldDisplayLogin: 2});
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
                    res.render('payment', {shouldDisplayLogin: 2});
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
                            res.render('payment', {shouldDisplayLogin: 2});
                        });
                    });
                });
            break;
    }
});
router.post('/', function(req, res) {
    var fromCity = req.body.depcity;
    var toCity = req.body.arrcity;
    var isRoundTrip = (req.body.isroundtrip == "roundtrip");
    var date = moment(req.body.outdate, "MM/DD/YYYY").format("YYYY-MM-DD") + " 00:00:00";
    var returnDate = req.body.returndate;

    console.log("1: " + fromCity);
    console.log("2: " + toCity);
    console.log("3: " + isRoundTrip);
    console.log("4: " + date);
    console.log("5: " + returnDate);

    async.parallel([
        async.apply(doSearch, 0, fromCity, toCity, date),
        async.apply(doSearch, 1, fromCity, toCity, date),
        async.apply(doSearch, 2, fromCity, toCity, date)], function(err, results) {
            var flightList = [];
            var priceList = [];
            var bookingList = [];
            var airportList = [];
            for(var i=0; i<results.length; i++) {
                flightList = flightList.concat(results[i]);
            }

            for(i=0;i<flightList.length; i++) {
                priceList.push(0);
                var fIDs = [];
                for(var j=0; j<flightList[i].length; j++) {
                    fIDs.push(flightList[i][j].flightID);
                }
                bookingList.push(fIDs);
            }
            var airportIDs = [];
            for(i=0;i<flightList.length; i++) {
                airportIDs.push([]);
                airportIDs[i].push(flightList[i][0].flight_takeoff);
                for(var j=0; j<flightList[i].length; j++) {
                    airportIDs[i].push(flightList[i][j].flight_landing)
                }
            }
        console.log(airportIDs);

        async.map(airportIDs, function(tripIDs, callback) {
            async.map(tripIDs, function(airportID, callback2) {
                db.query("SELECT * FROM threebee.airports WHERE airportID=?", [airportID], function(err, rows) {
                    callback2(err, rows[0]);
                });
            }, function(err, tripData) {
                callback(err, tripData);
            });
        }, function(err, airportData) {
            console.log(airportData);
            for(var i = 0; i<airportData.length; i++){
                airportList[i] = [];
                for(var j = 0; j<airportData[i].length; j++){
                    airportList[i].push({lat: airportData[i][j].latitude,lon:airportData[i][j].longitude});
                }
            }

            var colors = ["red", "green","purple","orange","brown","grey"]
            res.render('searchresults', {
                title:"Search Results",
                shouldDisplayLogin:(req.isAuthenticated() ? 1 : 0),
                flightList:flightList,
                priceList:priceList,
                bookingList:bookingList,
                airports:airportList,
                colors:colors
            });
        });




    });
});

function doSearch(numStops, fromCity, toCity, date, callback) {
    Flight.flightSearch(numStops, fromCity, toCity, date, function(err, results) {
        async.map(results, function(result, callback) {
            async.map(result, function(flightID, callback2) {
                Flight.queryOne(flightID, function(err, result) {
                    console.log(JSON.stringify(result, null, 4));
                    result.departureTime = moment(result.flight_firstFlight).format("LLL");
                    result.arrivalTime = moment(result.flight_firstFlight).add(result.flight_duration, "minutes").format("LLL");
                    callback2(err, result);
                });
            }, function(err, results) {
                callback(err, results);
            });
        }, function(err, results) {
            callback(err, results);
        });
    });
}

function searchAir(airportID) {
    db.query("SELECT a.latitude, a.longitude FROM threebee.airports a WHERE a.airportID=?",[flightList[i][0].flight_takeoff], function(err, row) {
        async.map(results, function(row, callback){
        });
    });


}
module.exports = router;