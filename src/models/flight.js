/**
 * Created by Tanner on 3/16/2017.
 */
/**
 * Created by Tanner on 3/6/2017.
 */
'use strict';

var db = require('../database');

function Flight(id,duration, firstFlight, turnover, planeID, takeoff, landing) {
    this.id = id;
    this.duration = duration;
    this.firstFlight = firstFlight;
    this.turnover = turnover;
    this.planeID = planeID;
    this.takeoff = takeoff;
    this.landing = landing;

    this.save = function (callback) {
        db.query("INSERT INTO flight_data (flight_duration, flight_firstFlight, flight_turnover, planeID, flight_takeoff, flight_landing) VALUES (?,?,?,?,?,?)", [this.duration, this.firstFlight, this.turnover, this.planeID, this.takeoff,this.landing], function (err) {
            if (err) {
                callback(err);
            } else {
                callback(err, this.lastID);
            }
        });
        var secondFlightDate = new Date("'" + this.firstFlight.value + "'");
        var tryIT = secondFlightDate.toISOString();
        secondFlightDate =  secondFlightDate.setTime(secondFlightDate.getTime()*60000+this.duration*60000+this.turnover*60000);
        db.query("INSERT INTO flight_data (flight_duration, flight_firstFlight, flight_turnover, planeID, flight_takeoff, flight_landing) VALUES (?,?,?,?,?,?)", [this.duration,tryIT, this.turnover, this.planeID, this.landing,this.takeoff], function (err) {
            if (err) {
                callback(err);
            } else {
                callback(err, this.lastID);
            }
        });
    };
    this.delete = function (callback) {

    }
}
Flight.delete = function (name,callback) {
    db.query("DELETE FROM threebee.flight_data WHERE airplane_name = '" +name+"';");
};
Flight.findOne = function (params, callback) {
    // create the array
    var stringArray = [];
    var paramArray = [];
    for (var prop in params) {
        if (params.hasOwnProperty(prop)) {
            stringArray.push("?=?");
            paramArray.push(prop);
            paramArray.push(params[prop]);
        }
    }
    db.query("SELECT * FROM threebee.flight_data WHERE (" + stringArray.join(" AND ") + ")", paramArray, function (err, row) {
        if (err) {
            callback(err, undefined);
            return;
        }
        if (row.length > 0) {
            var result = new Flight(row[0].idflight_data, row[0].name, row[0].numFirstSeat, row[0].numBizSeat, row[0].numCoachSeat);
            callback(err, result);
            return;
        }
        callback(err, undefined);
    });
};

Flight.findById = function (id, callback) {
    return Flight.findOne({id: id}, callback);
};

module.exports = Flight;