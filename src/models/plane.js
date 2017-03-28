/**
 * Created by Tanner on 3/6/2017.
 */
'use strict';

var db = require('../database');

function Plane(id,name, numFirstSeat, numBizSeat, numCoachSeat) {
    this.id = id;
    this.name = name;
    this.numFirstSeat = numFirstSeat;
    this.numBizSeat = numBizSeat;
    this.numCoachSeat = numCoachSeat;

    this.save = function (callback) {
        db.query("INSERT INTO airplane_type (airplane_name, airplane_firstSeats, airplane_buisnessSeats, airplane_coachSeats) VALUES (?,?,?,?)", [this.name, this.numFirstSeat, this.numBizSeat, this.numCoachSeat], function (err) {
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
Plane.delete = function (id) {
    db.query("DELETE FROM threebee.airplane_type WHERE airplaneID = '" +id+"';");
};
Plane.findOne = function (params, callback) {
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
    db.query("SELECT * FROM AIRPLANE_TYPE WHERE (" + stringArray.join(" AND ") + ")", paramArray, function (err, row) {
        if (err) {
            callback(err, undefined);
            return;
        }
        if (row.length > 0) {
            var result = new Plane(row[0].idairplane_type, row[0].name, row[0].numFirstSeat, row[0].numBizSeat, row[0].numCoachSeat);
            callback(err, result);
            return;
        }
        callback(err, undefined);
    });
};

Plane.findById = function (id, callback) {
    return Plane.findOne({id: id}, callback);
};

Plane.query = function (callback) {
    db.query("SELECT * FROM AIRPLANE_TYPE", function (err, rower) {
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
Plane.queryOne = function (id,callback) {
    db.query("SELECT * FROM AIRPLANE_TYPE WHERE airplaneID = '" +id+"';", function (err, rower) {
        console.log(rower);
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

module.exports = Plane;