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

function Booking(id, flightID, userID,type, lastID) {
    this.id = id;
    this.flightID = flightID;
    this.userID = userID;
    this.type = type;
    this.lastId = lastID;

    this.save = function (callback) {
        db.query("INSERT INTO bookings (flightID, userID, bookingType,nextBook) VALUES (?,?,?,?)", [this.flightID,this.userID,this.type,this.lastId], function (err, results, fields) {
            if (err) {
                callback(err);
            } else {
                callback(err, results.insertId);
            }
        });
    };
}
Booking.delete = function (id, callback) {
    db.query("UPDATE `threebee`.`bookings` SET `isActive`='0' WHERE bookingid = '" +id+"';");
    callback();
};

Booking.query = function (callback,row) {
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
Booking.findOne = function (id, callback) {
    db.query("SELECT * FROM threebee.bookings WHERE bookingID = '" +id+"' AND isActive = 1;", function (err, rower) {
        if (err) {
            callback(err, undefined);
            return;
        }
        if (rower.length > 0) {

            callback(err,rower);
            return;
        }
        callback(err, undefined);
    });
};
Booking.findHead = function (id, callback, row) {
    db.query("select * from bookings b WHERE NOT exists(select  * from bookings other WHERE b.bookingID = other.nextBook and userID = " + id + " and isActive=1);", function (err, row) {
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