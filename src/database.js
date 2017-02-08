/*
This will be used to handle the database connection
 */

var shouldUseMemory = true;

'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(shouldUseMemory ? ':memory:' : "../example.sqlite3");
if(shouldUseMemory) {
    // Set up the database
    db.run("CREATE TABLE `USER_TYPES` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `name` TEXT NOT NULL )");
    db.run("CREATE TABLE `USER` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `email` TEXT NOT NULL, `password` TEXT NOT NULL, `user_type` INTEGER NOT NULL DEFAULT 1, FOREIGN KEY(`user_type`) REFERENCES `USER_TYPES` )");
}

module.exports = db;