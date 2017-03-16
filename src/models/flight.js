/**
 * Created by Tanner on 3/16/2017.
 */
/**
 * Created by Tanner on 3/6/2017.
 */
'use strict';

var db = require('../database');

function Flight(id,name, numFirstSeat, numBizSeat, numCoachSeat) {
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
Flight.delete = function (name,callback) {
    db.query("DELETE FROM threebee.airplane_type WHERE airplane_name = '" +name+"';");
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
    db.query("SELECT * FROM AIRPLANE_TYPE WHERE (" + stringArray.join(" AND ") + ")", paramArray, function (err, row) {
        if (err) {
            callback(err, undefined);
            return;
        }
        if (row.length > 0) {
            var result = new Flight(row[0].idairplane_type, row[0].name, row[0].numFirstSeat, row[0].numBizSeat, row[0].numCoachSeat);
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