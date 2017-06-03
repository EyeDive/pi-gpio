/**
 * Created by amaud on 03/06/2017.
 */
"use strict";
const Gpio = require('../../src/Gpio/Gpio').Gpio,
    should = require("should"),
    fs = require("fs");

const gpioTest = function () {
    describe("Gpio", function () {
        describe("constant Gpio.DIRECTION_IN", function () {
            it("should be equal to 'in'", function () {
                Gpio.DIRECTION_IN.should.equal("in")
            });
        });
        describe("constant Gpio.DIRECTION_OUT", function () {
            it("should be equal to 'in'", function () {
                Gpio.DIRECTION_OUT.should.equal("out")
            });
        });
        describe("Instance with pin number 23", function () {
            it("should open without error", function (done) {
                let gpio;
                gpio = new Gpio(23);
                done();
            });
            it("should not have error on export", function (done) {
                let gpio = new Gpio(23);
                gpio.export()
                    .then(result => {
                        should.exist(result);
                        done();
                    })
                    .catch(error => {
                        should.not.exist(error);
                        done();
                    });
            });
            it("should have port numer 11", function (done) {
                let gpio = new Gpio(23);
                gpio.port.should.equal(11);
                done();
            });
            describe('.setDirection(in)', function () {
                it("sould be set to 'in'", function (done) {
                    let gpio = new Gpio(23);
                    gpio.export()
                        .then(() => {
                            return gpio.setDirection(Gpio.DIRECTION_IN);
                        })
                        .then(() => {
                            gpio.direction.should.equal(Gpio.DIRECTION_IN);
                            done();
                        })
                        .catch(error => {
                            should.not.exist(error);
                            done();
                        });
                });
            });
            describe(".read", function () {
                it("should return a value", function (done) {
                    let gpio = new Gpio(23);
                    this.timeout(0);
                    gpio.export()
                        .then(() => {
                            return gpio.setDirection(Gpio.DIRECTION_IN);
                        })
                        .then(() => {
                            return gpio.read();
                        })
                        .then(value => {
                            should.exist(value);
                            done();
                        })
                        .catch(error => {
                            should.not.exist(error);
                            done();
                        })
                        .catch(error => {
                            should.not.exist(error);
                            done();
                        });
                })
            });
            describe(".setDirection(out)", function() {
                it("sould be set to 'out'", function (done) {
                    let gpio = new Gpio(23);
                    gpio.export()
                        .then(() => {
                            return gpio.setDirection(Gpio.DIRECTION_OUT);
                        })
                        .then(() => {
                            gpio.direction.should.equal(Gpio.DIRECTION_OUT);
                            done();
                        })
                        .catch(error => {
                            should.not.exist(error);
                            done();
                        });
                });
            });
            describe(".write", function () {
                it("should not return an error", function (done) {
                    let gpio = new Gpio(23);
                    this.timeout(0);
                    gpio.export()
                        .then(() => {
                            return gpio.setDirection(Gpio.DIRECTION_OUT);
                        })
                        .then(() => {
                            return gpio.write(true);
                        })
                        .then(value => {
                            done();
                        })
                        .catch(error => {
                            should.not.exist(error);
                            done();
                        })
                        .catch(error => {
                            should.not.exist(error);
                            done();
                        });
                })
            });
        });
    })
};

module.exports = gpioTest;