/**
 * Created by Tanner on 3/16/2017.
 */
/**
 * Created by Tanner on 3/6/2017.
 */
'use strict';

var db = require('../database');

function Flight(id,duration, firstFlight, turnover, planeID, takeoff, landing, basePrice) {
    this.id = id;
    this.duration = duration;
    this.firstFlight = firstFlight;
    this.turnover = turnover;
    this.planeID = planeID;
    this.takeoff = takeoff;
    this.landing = landing;
    this.basePrice = basePrice;

    this.save = function (callback) {
        db.query("INSERT INTO flight_data (flight_duration, flight_firstFlight, flight_turnover, planeID, flight_takeoff, flight_landing, flight_basePrice, flight_isActive) VALUES (?,?,?,?,?,?,?,1)", [this.duration, this.firstFlight, this.turnover, this.planeID, this.takeoff,this.landing, this.basePrice], function (err, results, fields) {
            if (err) {
                callback(err);
            } else {
                callback(err, results.insertId);
            }
        });
    };

    this.updateFlight = function(callback) {
        db.query("UPDATE `threebee`.`flight_data` SET flight_duration=?, planeID=?, flight_firstFlight=?, flight_turnover=?, flight_takeoff=?, flight_landing=?, flight_basePrice=? WHERE flightID=?",
            [this.duration, this.planeID, this.firstFlight, this.turnover, this.takeoff, this.landing, this.basePrice, this.id], function(err, results){
                if(err) {
                    callback(err);
                } else {
                    //insertId will be the autoincrement primary key iduser_info
                    console.log('we were apparently a success in updating that shit');
                    callback(err, results.insertId);
                }

            });
    };

}
Flight.delete = function (id, callback) {
    db.query("UPDATE `threebee`.`flight_data` SET `flight_isActive`='0' WHERE flightID = ?", [id], function(err) {
        db.query("UPDATE `bookings` SET `isActive`=0 WHERE flightID=?", [flight.flightID], function(err) {
            callback(err);
        });
    });
};
Flight.deletePlane = function (id, callback) {
    db.query("UPDATE `threebee`.`flight_data` SET `flight_isActive`='0' WHERE planeID = ?",[id]);
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
    db.query("SELECT \
    fd.flightID,\
        fd.flight_duration,\
        fd.flight_firstFlight,\
        fd.flight_turnover,\
        fd.planeID,\
        fd.flight_takeoff,\
        fd.flight_landing,\
        fd.flight_isActive,\
        fd.flight_basePrice,\
        a1.printName AS takeoff,\
        a1.abbr AS takeoffAbbr,\
        a2.printName AS landing,\
        a2.abbr AS landingAbbr,\
        a.airplane_name AS planeName\
    FROM\
    threebee.flight_data fd\
    JOIN\
    threebee.airports a1 ON fd.flight_takeoff = a1.airportID\
    JOIN\
    threebee.airports a2 ON fd.flight_landing = a2.airportID\
    JOIN\
    threebee.airplane_type a ON fd.planeID = a.airplaneID\
    WHERE fd.flight_isActive=1;", function (err, row) {
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
    db.query("SELECT \
    fd.flightID,\
        fd.flight_duration,\
        fd.flight_firstFlight,\
        fd.flight_turnover,\
        fd.planeID,\
        fd.flight_takeoff,\
        fd.flight_landing,\
        fd.flight_isActive,\
        fd.flight_basePrice,\
        a1.printName AS takeoff,\
        a1.abbr AS takeoffAbbr,\
        a2.printName AS landing,\
        a2.abbr AS landingAbbr,\
        a.airplane_name AS planeName\
    FROM\
    threebee.flight_data fd\
    JOIN\
    threebee.airports a1 ON fd.flight_takeoff = a1.airportID\
    JOIN\
    threebee.airports a2 ON fd.flight_landing = a2.airportID\
    JOIN\
    threebee.airplane_type a ON fd.planeID = a.airplaneID\
    WHERE fd.flight_isActive=1 AND fd.flightID=?", [id], function (err, row) {
        if (err) {
            callback(err, undefined);
            return;
        }
        if (row.length > 0) {
            callback(err,row[0]);
            return;
        }
        callback(err,undefined);
    });
};

Flight.queryMany = function (ids,callback) {
    db.query("SELECT \
    fd.flightID,\
        fd.flight_duration,\
        fd.flight_firstFlight,\
        fd.flight_turnover,\
        fd.planeID,\
        fd.flight_takeoff,\
        fd.flight_landing,\
        fd.flight_isActive,\
        fd.flight_basePrice,\
        a1.printName AS takeoff,\
        a1.abbr AS takeoffAbbr,\
        a2.printName AS landing,\
        a2.abbr AS landingAbbr,\
        a.airplane_name AS planeName\
    FROM\
    threebee.flight_data fd\
    JOIN\
    threebee.airports a1 ON fd.flight_takeoff = a1.airportID\
    JOIN\
    threebee.airports a2 ON fd.flight_landing = a2.airportID\
    JOIN\
    threebee.airplane_type a ON fd.planeID = a.airplaneID\
    WHERE fd.flight_isActive=1 AND (fd.flightID=? OR fd.flightID=? OR fd.flightID=?)", [id[0],id[1], id[2]], function (err, row) {
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

Flight.findPrices = function(ids, callback){
    console.log('ids: '+ids);
    console.log('we are finding prices for '+ids.length+' flights');
    var idString="";
    for(var i = 0; i< ids.length; i++){
        console.log('we are concatenating the prices..');
        console.log('id:'+ids[i].toString())
        if(i==0){
            idString += ids[i];
        }else {
            idString += ',';
            idString += ids[i];
            console.log(idString);
        }
    }
    var query = "SELECT flight_basePrice FROM threebee.flight_data WHERE `flightID` IN ("+idString+")";
    console.log(query);
    db.query("SELECT * FROM threebee.flight_data WHERE `flightID` IN ("+idString+")", function(err,results){
        if(err){
            console.log('there was an error');
            callback(err, undefined);
        } else if (results.length > 0){
            console.log('we found your shit');
            callback(err, results);
        }

    });
};

Flight.flightSearch = function(numStops, startAirport, endAirport, date, callback) {
    var q = "";
    if(numStops == 0) {
        // We want a direct flight
        q = "SELECT fd1.flightID as flightID1 FROM\
        flight_data as fd1\
        WHERE fd1.flight_takeoff=? AND fd1.flight_landing=? AND DATE(fd1.flight_firstFlight)=DATE(?) AND fd1.flight_isActive=1";
    } else if(numStops == 1) {
        // We want one layover
        q = "SELECT fd1.flightID as flightID1, fd2.flightID as flightID2 FROM\
        flight_data as fd1\
        JOIN\
        flight_data as fd2 ON (fd1.flight_landing=fd2.flight_takeoff AND fd2.flight_firstFlight >= fd1.flight_firstFlight + interval (fd1.flight_duration + 10) minute AND fd2.flight_firstFlight < fd1.flight_firstFlight + interval (fd1.flight_duration + 360) minute)\
        WHERE fd1.flight_takeoff=? AND fd2.flight_landing=? AND DATE(fd1.flight_firstFlight)=DATE(?) AND fd1.flight_isActive=1  AND fd2.flight_isActive=1";
    } else if(numStops == 2) {
        // We want 2 layovers
        q = "SELECT fd1.flightID as flightID1, fd2.flightID as flightID2, fd3.flightID as flightID3 FROM\
        flight_data as fd1\
        JOIN\
        flight_data as fd2 ON (fd1.flight_landing=fd2.flight_takeoff AND fd2.flight_firstFlight >= fd1.flight_firstFlight + interval (fd1.flight_duration + 10) minute AND fd2.flight_firstFlight < fd1.flight_firstFlight + interval (fd1.flight_duration + 360) minute)\
        JOIN\
        flight_data as fd3 ON (fd2.flight_landing=fd3.flight_takeoff AND fd3.flight_firstFlight >= fd2.flight_firstFlight + interval (fd2.flight_duration + 10) minute AND fd3.flight_firstFlight < fd2.flight_firstFlight + interval (fd2.flight_duration + 360) minute)\
        WHERE fd1.flight_takeoff=? AND fd3.flight_landing=? AND DATE(fd1.flight_firstFlight)=DATE(?) AND fd1.flight_isActive=1 AND fd2.flight_isActive=1 AND fd3.flight_isActive=1";
    }
    db.query(q, [startAirport, endAirport, date], function(err, rows) {
        if(err) {
            console.log(err);
            callback(err, null);
        } else {
            var result = [];
            for (var i = 0; i < rows.length; i++) {
                var row = [];
                if (numStops >= 0)
                    row.push(rows[i].flightID1);
                if (numStops >= 1)
                    row.push(rows[i].flightID2);
                if (numStops >= 2)
                    row.push(rows[i].flightID3);
                result.push(row);
            }
            callback(null, result);
        }
    });
};

Flight.getModifier = function(tierIndex, callback) {

    db.query("SELECT * from threebee.pricing_modifiers WHERE modifier=?", [tierIndex], function (err, result) {
        if(err){
            console.log(err);
        } else {
            console.log('found the modifier: '+result.modifier);
            callback(err, result);
        }
    });
};



module.exports = Flight;