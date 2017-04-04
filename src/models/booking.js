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
    db.query("UPDATE `threebee`.`bookings` SET `isActive`='0' WHERE bookingid = '" +id+"';");
    callback();
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