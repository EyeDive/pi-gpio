/**
 * Created by amaud on 03/06/2017.
 */
"use strict";
const Port = require('./Port').Port;

/**
 * Command class. Represents a Command port
 *
 * @author Anthony Maudry <anthony.maudry@eye-dive.com>
 *
 * @license MIT
 */
class Gpio extends Port{
    // GETTERS
    get exportable() {
        return true;
    }

    get readable() {
        return true;
    }

    get writable() {
        return true;
    }

    get display() {
        return `GPIO ${this.port}`;
    }
}

module.exports = {
    Gpio: Gpio
};