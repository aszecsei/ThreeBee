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
        db.query("INSERT INTO flight_data (flight_duration, flight_firstFlight, flight_turnover, planeID, flight_takeoff, flight_landing, flight_isActive) VALUES (?,?,?,?,?,?,1)", [this.duration, this.firstFlight, this.turnover, this.planeID, this.takeoff,this.landing], function (err) {
            if (err) {
                callback(err);
            } else {
                callback(err, this.lastID);
            }
        });
    };
}
Flight.delete = function (id, callback) {
    db.query("UPDATE `threebee`.`flight_data` SET `flight_isActive`='0' WHERE flightID = '" +id+"';");
    callback();
};
Flight.deletePlane = function (id, callback) {
    db.query("UPDATE `threebee`.`flight_data` SET `flight_isActive`='0' WHERE planeID = '" +id+"';");
    callback();
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

Flight.query = function (callback) {
    db.query("SELECT * FROM threebee.flight_data WHERE flight_isActive = 1", function (err, row) {
        if (err) {
            callback(err, undefined);
            return;
        }
        if (row.length > 0) {
            callback(err,row);
            return;
        }
        callback(err,undefined);
    });
};

Flight.queryOne = function (id,callback) {
    db.query("SELECT * FROM threebee.flight_data WHERE planeID = '" +id+"' AND flight_isActive = 1;", function (err, row) {
        if (err) {
            callback(err, undefined);
            return;
        }
        if (row.length > 0) {
            callback(err,row);
            return;
        }
        callback(err,undefined);
    });
};
module.exports = Flight;