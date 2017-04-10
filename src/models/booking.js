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
var async = require('async')

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

Booking.getAllForUser = function(userid, callback) {
    db.query("SELECT * FROM threebee.bookings b WHERE userID=? AND isActive=1 AND NOT EXISTS(SELECT 1 FROM threebee.bookings other WHERE b.bookingID=other.nextBook)", [userid], function(err, rows){
        if(err) {
            callback(err, undefined);
        } else {
            async.map(rows, function(row, callback1) {
                if(row.nextBook) {
                    db.query("SELECT * FROM threebee.bookings WHERE isActive=1 AND bookingID=?", [row.nextBook], function (err, rows2) {
                        if (err) {
                            callback1(err, null);
                        } else {
                            if (rows2 && rows2.length > 0) {
                                if(rows2[0].nextBook) {
                                    db.query("SELECT * FROM threebee.bookings WHERE isActive=1 AND bookingID=?", [rows2[0].nextBook], function (err, rows3) {
                                        if (err) {
                                            callback1(err, null);
                                        } else {
                                            if (rows3 && rows3.length > 0) {
                                                callback1(null, [row, rows2[0], rows3[0]]);
                                            } else {
                                                callback1(null, [row, rows2[0]]);
                                            }
                                        }
                                    });
                                } else {
                                    callback1(null, [row, rows2[0]]);
                                }
                            } else {
                                callback1(null, [row]);
                            }
                        }
                    });
                } else {
                    callback1(null, [row]);
                }
            }, function(err, results) {
                console.log("User Query: " + results);
                callback(null, results);
            });
        }
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