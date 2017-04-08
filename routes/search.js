var express = require('express');
var router = express.Router();
var Flight = require('../src/models/flight');

var async = require('async');
var moment = require('moment');
var db = require('../src/database');

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
        console.log("woo!");
            var flightList = [];
            for(var i=0; i<results.length; i++) {
                flightList = flightList.concat(results[i]);
            }
            console.log(JSON.stringify(flightList, null, 4));
            res.render('searchresults', {
                flightList:flightList
            });
    });
});

function doSearch(numStops, fromCity, toCity, date, callback) {
    console.log("Doing search " + numStops);
    Flight.flightSearch(numStops, fromCity, toCity, date, function(err, results) {
        console.log("RESULTS: " + JSON.stringify(results, null, 4));
        async.map(results, function(result, callback) {
            async.map(result, function(flightID, callback2) {
                db.query("SELECT * FROM `flight_data` WHERE flightID=?", [flightID], function(err, rows) {
                    callback2(err, rows[0]);
                });
            }, function(err, results) {
                callback(err, results);
            });
        }, function(err, results) {
            callback(err, results);
        });
    });
}

module.exports = router;