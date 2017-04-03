/**
 * Created by Tanner on 4/2/2017.
 */
/**
 * Created by Tanner on 3/16/2017.
 */
/**
 * Created by Tanner on 3/6/2017.
 */
'use strict';

var db = require('../database');

function Booking(id, flightID, userID,type) {
    this.id = id;
    this.flightID = flightID;
    this.userID = userID;
    this.type = type;

    this.save = function (callback) {
        db.query("INSERT INTO bookings (flightID, userID, bookingType VALUES (?,?,?)", [this.flightID,this.userID,title.type], function (err) {
            if (err) {
                callback(err);
            } else {
                callback(err, this.lastID);
            }
        });
    };
}
Booking.delete = function (id, callback) {
    db.query("UPDATE `threebee`.`flight_data` SET `flight_isActive`='0' WHERE flightID = '" +id+"';");
    callback();
};
Booking.deletePlane = function (id, callback) {
    db.query("UPDATE `threebee`.`flight_data` SET `flight_isActive`='0' WHERE planeID = '" +id+"';");
    callback();
};
Booking.findOne = function (params, callback) {
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

Booking.findById = function (id, callback) {
    return Flight.findOne({id: id}, callback);
};

Booking.query = function (callback) {
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

Booking.queryOne = function (id,callback) {
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
module.exports = Booking;