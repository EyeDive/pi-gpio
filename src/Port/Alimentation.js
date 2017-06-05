"use strict"
const Port = require('./Port').Port;

/**
 * Class for Alimentation type port
 *
 * @author Anthony Maudry <anthony.maudry@eye-dive.com>
 *
 * @license MIT
 */
class Alimentation extends Port {
    // GETTERS
    get display() {
        return `${this.port}`;
    }
}

module.exports = {
    Alimentation: Alimentation
};