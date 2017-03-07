/**
 * Created by Tanner on 3/6/2017.
 */
'use strict';

var db = require('../database');


function Plane(name, numFirstSeat, numBizSeat, numCoachSeat) {
    this.name = name;
    this.numFirstSeat = numFirstSeat;
    this.numBizSeat = numBizSeat;
    this.numCoachSeat = numCoachSeat;
    this.save = function (callback) {
        db.query("INSERT INTO `airplane_type` (airplane_name, airplane_firstSeats, airplane_buisnessSeats, airplane_coachSeats) VALUES (?,?,?, ?)", [this.name, this.numFirstSeat, this.numBizSeat, this.numCoachSeat],  function(err) {
            if(err) {
                callback(err);
            } else {
                callback(err, this.lastID);
            }
        });
    }
}
Plane.findOne = function (params, callback) {
    // create the array
    var stringArray = [];
    var paramArray = [];
    for(var prop in params) {
        if(params.hasOwnProperty(prop)) {
            stringArray.push("?=?");
            paramArray.push(prop);
            paramArray.push(params[prop]);
        }
    }
    db.query("SELECT * FROM `airplane_type` WHERE (" + stringArray.join(" AND ") + ")", paramArray, function(err, row) {
        if(err) {
            callback(err, undefined);
            return;
        }
        if(row.length > 0) {
            var result = new User(row[0].id, row[0].email, row[0].password, row[0].user_type, row[0].auth_status);
            callback(err, result);
            return;
        }
        callback(err, undefined);
    });
};