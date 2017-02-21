/* user.js */

'use strict';

var db = require('../database');
var bcrypt   = require('bcrypt-nodejs');

function User(id, email, password, userType) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.user_type = userType;

    this.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    this.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };
    this.generateTempPass = function() {
        const lowChars = "abcdefghijklmnopqrstuvwxyz".split("");
        const capChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const numChars = "0123456789".split("");
        const spcChars = "~!@#$%^&*_-+=?".split("");
        const allChars = lowChars.concat(capChars).concat(numChars).concat(spcChars); // Create arrays of each type of character

        var strings =  [lowChars[Math.floor(Math.random() * lowChars.length)],
                        capChars[Math.floor(Math.random() * capChars.length)],
                        numChars[Math.floor(Math.random() * numChars.length)],
                        spcChars[Math.floor(Math.random() * spcChars.length)]]; // Create 4 strings, each of which has a required character type

        var selection;

        for(var i=0; i<16; i++) {
            selection = Math.floor(Math.random() * strings.length); // Select a string to alter
            strings[selection] = (Math.random() > 0.5) ?
                (strings[selection] + allChars[Math.floor(Math.random() * allChars)]) :
                allChars[Math.floor(Math.random() * allChars)] + strings[selection]; // Randomly append or prepend a random character to our selected string
        }
        var result = "";
        while(strings.length > 0) {
            selection = Math.floor(Math.random() * strings.length); // Select a string to add
            result += strings[selection]; // Add it to our result
            strings.splice(selection, 1); // Remove the selected string from the array of strings
        }
        return result;
    };
    this.save = function (callback) {
        return db.run("INSERT OR IGNORE INTO USER (email, password, user_type) VALUES (?,?,?)", [this.email, this.password, this.user_type],  function(err) {
            if(err) {
                callback(err);
            } else {
                callback(err, this.lastID);
            }
        });
    }
}


User.findOne = function (params, callback) {
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
    return db.get("SELECT * FROM USER WHERE (" + stringArray.join(" AND ") + ")", paramArray, function(err, row) {
        if(err) {
            callback(err, undefined);
            return;
        }
        if(row) {
            var result = new User(row.id, row.email, row.password, row.user_type);
            callback(err, result);
            return;
        }
        callback(err, undefined);
    });
};

User.findById = function (id, callback) {
    return User.findOne({id: id}, callback);
};

module.exports = User;