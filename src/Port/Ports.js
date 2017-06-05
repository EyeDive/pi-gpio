/**
 * Module exporting the various ports types
 *
 * @author Anthony Maudry <anthony.maudry@eye-dive.com>
 *
 * @license MIT
 */

const Alimentation = require('./Alimentation').Alimentation;
const Gpio = require('./Gpio').Gpio;
const Ground = require('./Ground').Ground;
const Idsd = require('./Idsd').Idsd;

module.exports = {
    Alimentation: Alimentation,
    Gpio: Gpio,
    Ground: Ground,
    Idsd: Idsd
};
