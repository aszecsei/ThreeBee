/* user.js */

'use strict';

var db = require('../database');
var bcrypt   = require('bcrypt-nodejs');

function User(id, email, password, userType, authStatus, deleted, first_name, last_name, street_addr, city, state, zip, country) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.user_type = userType;
    this.auth_status = authStatus;
    this.deleted = deleted;

    //user info
    this.first_name = first_name;
    this.last_name = last_name;
    this.street_addr = street_addr;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.country = country;

    this.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    this.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };
    this.generateTempPass = function() {
        var lowChars = "abcdefghijklmnopqrstuvwxyz".split("");
        var capChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        var numChars = "0123456789".split("");
        var spcChars = "~!@#$%^&*_-+=?".split("");
        var allChars = lowChars.concat(capChars).concat(numChars).concat(spcChars); // Create arrays of each type of character

        var strings =  [lowChars[Math.floor(Math.random() * lowChars.length)],
                        capChars[Math.floor(Math.random() * capChars.length)],
                        numChars[Math.floor(Math.random() * numChars.length)],
                        spcChars[Math.floor(Math.random() * spcChars.length)]]; // Create 4 strings, each of which has a required character type

        var selection;

        for(var i=0; i<16; i++) {
            selection = Math.floor(Math.random() * strings.length); // Select a string to alter
            strings[selection] = (Math.random() > 0.5) ?
                (strings[selection] + allChars[Math.floor(Math.random() * allChars.length)]) :
                allChars[Math.floor(Math.random() * allChars.length)] + strings[selection]; // Randomly append or prepend a random character to our selected string
        }
        var result = "";
        while(strings.length > 0) {
            selection = Math.floor(Math.random() * strings.length); // Select a string to add
            result += strings[selection]; // Add it to our result
            strings.splice(selection, 1); // Remove the selected string from the array of strings
        }
        return result;
    };

    this.generateToken = function() {
        var lowChars = "abcdefghijklmnopqrstuvwxyz".split("");
        var capChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        var numChars = "0123456789".split("");
        var allChars = lowChars.concat(capChars).concat(numChars);
        var result = "";

        // The format is XXXXXXXX-XXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXX
        for(var i=0; i<8; i++) {
            result += allChars[Math.floor(Math.random() * allChars.length)];
        }
        result += "-";
        for(i=0; i<16; i++) {
            result += allChars[Math.floor(Math.random() * allChars.length)];
        }
        result += "-";
        for(i=0; i<16; i++) {
            result += allChars[Math.floor(Math.random() * allChars.length)];
        }
        return result;
    };


    this.checkPass = function(password) {
        if (password.length < 8) {
            return false
        } else {
            return (password.search('/[A-Z]/') == -1) && (password.search('/[0-9]/') == -1) && (password.search('/[a-z]/') == -1);
        }
    };

    this.save = function (callback) {
        db.query("INSERT INTO `users` (email, password, user_type, auth_status, deleted) VALUES (?,?,?, ?, 0)", [this.email, this.password, this.user_type, this.auth_status],  function(err, results, fields) {
            if(err) {
                callback(err);
            } else {
                callback(err, results.insertId);
            }
        });
    };

    this.update = function(callback) {
        db.query("UPDATE `users` SET email=?, password=?, user_type=?, auth_status=?, deleted=? WHERE user_id=?", [this.email, this.password, this.user_type, this.auth_status, this.deleted, this.id], function(err, results, fields) {
            if(err) {
                callback(err);
            } else {
                callback(err, results.insertId);
            }
        });
    };


    this.insertUserInfo = function(callback) {
        db.query("INSERT INTO `user_info` (user_id, first_name, last_name, street_addr, city, state, zip, country) VALUES (?,?,?,?,?,?,?,?)",
            [this.id, this.first_name, this.last_name, this.street_addr, this.city, this.state, this.zip, this.country], function(err, results, fields){
            if(err) {
                callback(err);
            } else {
                //intertId will be the autoincrement primary key iduser_info
                callback(err, results.insertId);
            }

        });
    }

    this.updateUserInfo = function(callback) {
        db.query("UPDATE `user_info` SET first_name=?, last_name=?, street_addr=?, city=?, state=?, zip=?, country=? WHERE user_id=?",
            [this.first_name, this.last_name, this.street_addr, this.city, this.state, this.zip, this.country, this.id], function(err, results, fields){
                if(err) {
                    callback(err);
                } else {
                    //intertId will be the autoincrement primary key iduser_info
                    callback(err, results.insertId);
                }

            });
    }

    this.lookupUserInfo = function(callback) {
        db.query("SELECT * FROM `USER_INFO` WHERE user_id=?", [this.id], function(err, results, fields){
            if(err) {
                callback(err);
            } else {
                callback(err, results);
            }
        })

    }
}


User.findOne = function (params, callback) {
    // create the array
    var stringArray = [];
    var paramArray = [];
    for(var prop in params) {
        if(params.hasOwnProperty(prop)) {
            stringArray.push("`USERS`." + prop + "=?");
            paramArray.push(params[prop]);
        }
    }
    var query = "SELECT `USERS`.*, first_name, last_name, street_addr, city, state, zip, country\
    FROM `USERS`\
    LEFT JOIN	`USER_INFO`\
    ON	`USERS`.user_id=`USER_INFO`.user_id WHERE " + stringArray.join(" AND ");
    console.log(query);
    db.query(query, paramArray, function(err, row) {
        console.log("USER QUERY: " + JSON.stringify(row, null, 4));
        if(err) {
            callback(err, undefined);
            return;
        }
        if(row.length > 0) {
            var result = new User(row[0].user_id, row[0].email, row[0].password, row[0].user_type, row[0].auth_status, row[0].deleted,
                row[0].first_name, row[0].last_name, row[0].street_addr, row[0].city, row[0].state, row[0].zip, row[0].country );
            callback(err, result);
            return;
        } else {
            callback(err, undefined);
        }
    });
};

User.findById = function (id, callback) {
    return User.findOne({user_id: id}, callback);
};

module.exports = User;