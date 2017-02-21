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
        var password = [];
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=';
        for(var j=1;j<5;j++) {
            password[j] = ""
            for (var i = 1; i < 5; i++) {
                var c = Math.floor(Math.random() * chars.length + 1);
                password[j] += chars.charAt(c)
            }
        }
        while((password[1].search('/[A-Z]/') !==-1)){
            for (var i = 1; i < 5; i++) {
                var c = Math.floor(Math.random() * chars.length + 1);
                password[1] += chars.charAt(c)
            }
        }
        while((password[2].search('/[a-z]/') !==-1)){
            for (var i = 1; i < 5; i++) {
                var c = Math.floor(Math.random() * chars.length + 1);
                password[2] += chars.charAt(c)
            }
        }
        while((password[1].search('/[0-9]/') !==-1)){
            for (var i = 1; i < 5; i++) {
                var c = Math.floor(Math.random() * chars.length + 1);
                password[1] += chars.charAt(c)
            }
        }
        while((password[1].search('/[-!$%^&*()_+|~=`{}[]:/;<>?,.@#]/') !==-1)){
            for (var i = 1; i < 5; i++) {
                var c = Math.floor(Math.random() * chars.length + 1);
                password[1] += chars.charAt(c)
            }
        }
        var passwordEnd = password[1]+password[2]+password[3]+password[4];



        return passwordEnd;
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