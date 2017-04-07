var express = require('express');
var router = express.Router();
var Flight = require('../src/models/flight');

var async = require('async');
var moment = require('moment');

router.post('/', function(req, res) {
    var fromCity = req.body.dep-city;
    var toCity = req.body.arr-city;
    var isRoundTrip = req.body.isroundtrip;
    var date = req.body.outward-date;

    async.parallel([
        async.apply(doSearch, 0, fromCity, toCity, date),
        async.apply(doSearch, 1, fromCity, toCity, date),
        async.apply(doSearch, 2, fromCity, toCity, date)], function(err, results) {
        console.log("woo!");
            var flightList = [];
            for(var i=0; i<results.length; i++) {
                flightList = flightList.concat(results[i]);
            }
            console.log(json.stringify(flightList, null, 4));
            res.render('searchresults', {
                flightList:flightList
            });
    });
});

function doSearch(numStops, fromCity, toCity, date, callback) {
    Flight.flightSearch(numStops, fromCity, toCity, date, function(err, results) {
        console.log("RESULTS: " + json.stringify(results, null, 4));
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