/*
This will be used to handle the database connection
 */

var shouldUseMemory = true;

'use strict';

var mysql      = require('mysql');

var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'threebee',
    password        : '3bees!',
    database        : 'threebee'
});


// TODO: Check if database is set up; if not, do it

module.exports = pool;