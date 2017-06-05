/**
 * Created by amaud on 03/06/2017.
 */
"use strict";
const fs = require('fs');
const Port = require('../Port/Port').Port;
const Ports = require('../Port/Ports');
const mapSelector = require('./MapSelector').instance;

/**
 * PortMapping maps numeral pin numbers (pin number) to Broadcom pin number (port number)
 *
 * @author Anthony Maudry <anthony.maudry@eye-dive.com>
 *
 * @license MIT
 */
class PortMapping {

    /**
     * Constructor
     */
    constructor() {
        this._pinMapping = null;
        this._buildMapping();
    }

    /**
     * Builds the mapping array
     *
     * @private
     */
    _buildMapping() {
        this._pinMapping = mapSelector.getMapForCurrentRevision().mapping;
    }

    /**
     * Sanitizes a pin number
     *
     * @param pinNumber
     * @returns {Number}
     * @private
     */
    _sanitizePinNumber(pinNumber) {
        if (isNaN(pinNumber) || typeof this._pinMapping[pinNumber] !== typeof {}) {
            throw new Error(`Pin ${pinNumber} number isn't valid`);
        }

        return parseInt(pinNumber, 10);
    }

    /**
     * Converts a lib's pin number to an instance of a class
     * extending the `Port` class.
     * The object return will provide all methods needed to
     * interact with it.
     *
     * @param {Number} pinNumber
     *
     * @return {Port}
     */
    mapToPortClass(pinNumber) {
        pinNumber = this._sanitizePinNumber(pinNumber);
        switch(this._pinMapping[pinNumber].type) {
            case 'GPIO' :
                return new Ports.Gpio(pinNumber, this._pinMapping[pinNumber].port);
            case 'Ground' :
                return new Ports.Ground(pinNumber, this._pinMapping[pinNumber].port);
            case 'Alimentation' :
                return new Ports.Alimentation(pinNumber, this._pinMapping[pinNumber].port);
            case 'IDSD' :
                return new Ports.Idsd(pinNumber, this._pinMapping[pinNumber].port);
        }
    }

    /**
     * Maps a pin number to a Bradcom port number
     *
     * @param pinNumber
     * @returns {*}
     */
    mapToGpioPort(pinNumber) {
        pinNumber = this._sanitizePinNumber(pinNumber)
        return this._pinMapping[pinNumber].port;
    }

    /**
     * Gets a singleton instance og PortMapping
     *
     * @returns {PortMapping}
     */
    static get instance() {
        if (!PortMapping._instance) {
            PortMapping._instance = new PortMapping();
        }

        return PortMapping._instance;
    }
}

const portMapper = PortMapping.instance;

module.exports = {
    portMapper: portMapper
};