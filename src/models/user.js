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
    return db.get("SELECT * FROM USER WHERE (?)", params, function(err, row) {
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