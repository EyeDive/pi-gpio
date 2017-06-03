/**
 * Created by amaud on 03/06/2017.
 */
"use strict";
const fs = require('fs');

/**
 * GpioMapping maps numeral pin numbers (pin number) to Broadcom pin number (port number)
 */
class GpioMapping {

    /**
     * Constructor
     */
    constructor() {
        const rev = fs.readFileSync("/proc/cpuinfo").toString().split("\n").filter(function (line) {
            return line.indexOf("Revision") === 0;
        })[0].split(":")[1].trim();

        this._buildMapping(rev);
    }

    /**
     * Builds the mapping array
     *
     * @param rev The cpu revision
     * @private
     */
    _buildMapping(rev) {
        this._pinMapping = {
            "3": 0,
            "5": 1,
            "7": 4,
            "8": 14,
            "10": 15,
            "11": 17,
            "12": 18,
            "13": 21,
            "15": 22,
            "16": 23,
            "18": 24,
            "19": 10,
            "21": 9,
            "22": 25,
            "23": 11,
            "24": 8,
            "26": 7,

            // Model A+ and Model B+ pins
            "29": 5,
            "31": 6,
            "32": 12,
            "33": 13,
            "35": 19,
            "36": 16,
            "37": 26,
            "38": 20,
            "40": 21
        };

        if (rev === 2) {
            this._pinMapping["3"] = 2;
            this._pinMapping["5"] = 3;
            this._pinMapping["13"] = 27;
        }
    }

    /**
     * Sanitizes a pin number
     *
     * @param pinNumber
     * @returns {Number}
     * @private
     */
    _sanitizePinNumber(pinNumber) {
        if (isNaN(pinNumber) || isNaN(this._pinMapping[pinNumber])) {
            throw new Error("Pin number isn't valid");
        }

        return parseInt(pinNumber, 10);
    }

    /**
     * Maps a pin number to a Bradcom port number
     *
     * @param pinNumber
     * @returns {*}
     */
    mapToGpioPort(pinNumber) {
        pinNumber = this._sanitizePinNumber(pinNumber)
        return this._pinMapping[pinNumber];
    }

    /**
     * Maps a pin number to a Gpio directory
     *
     * @param pinNumber
     * @returns {string}
     */
    mapToGpioDirectory(pinNumber) {
        pinNumber = this._sanitizePinNumber(pinNumber)
        return `gpio${this._pinMapping[pinNumber]}`;
    }

    /**
     * Gets a singleton instance og GpioMapping
     *
     * @returns {GpioMapping}
     */
    static get instance() {
        if (!GpioMapping._instance) {
            GpioMapping._instance = new GpioMapping();
        }

        return GpioMapping._instance;
    }
}
const gpioMapper = GpioMapping.instance;

module.exports = {
    gpioMapper: gpioMapper
};