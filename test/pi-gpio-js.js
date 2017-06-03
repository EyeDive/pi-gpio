"use strict";
const gpioManager = require("../pi-gpio-js"),
    should = require("should"),
    fs = require("fs"),
    gpioTest = require('./Gpio/Gpio'),
    Gpio = require('../src/Gpio/Gpio').Gpio;

describe("GpioManager", function () {
    describe('.open', function() {
        it("should open a Gpio port", function (done) {
            return gpioManager.open(23)
                .then(gpio => {
                    gpio.should.be.an.instanceOf(Gpio);
                })
                .then(done, done)
                .catch(error => {
                    should.not.exist(error);
                });
        });

        it("should not open a non-gpio port", function(done) {
            gpioManager.open(1)
                .then(gpio => {
                    should.not.exist(gpio);
                })
                .catch(error => {
                    should.exist(error);
                    done();
                });
        });
    });

    gpioTest();

    after(function(done) {
        describe(".close", function() {
            it("should close a Gpio port", function(done) {
                gpioManager.close(23)
                    .then(result => {
                        result.should.be.a.Boolean;
                        done();
                    })
                    .catch(error => {
                        should.not.exist(error);
                        done();
                    });
            });

        });
        done();
    });
});