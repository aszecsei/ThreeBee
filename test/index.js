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

    describe("Database", function () {
        it("Users can be added and retrieved from the database", function () {
            var newUser = new User();
            newUser.email = "beep@boop.com";
            newUser.password = newUser.generateHash("password");
            newUser.user_type = 1;
            newUser.save(function(err, id) {
                expect(err).to.not.exist();
                expect(id).to.exist();
                User.findOne({email: "beep@boop.com"}, function(err, mUser) {
                    expect(err).to.not.exist();
                    expect(mUser).to.exist();
                    done();
                })
            });
        });
    });
});