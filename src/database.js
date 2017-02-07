/*
This will be used to handle the database connection
 */

'use strict';

module.exports = function () {
    var sqlite3 = require('sqlite3').verbose();
    return new sqlite3.Database(':memory:');
};