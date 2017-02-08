/* Unit tests for the ThreeBee project */

'use strict';

var expect    = require("chai").expect;
var request = require("request");
var User = require("../src/models/user");

describe("Web", function() {
    it("Index returns status 200", function () {
        var url = "http://localhost:3000/";
        request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});

describe("User", function() {
    describe("Password Hashing", function() {
        it("Hashes passwords match", function() {
            var user = new User();
            user.password = user.generateHash("password");
            expect(user.validPassword("password"));
        });
    });
});