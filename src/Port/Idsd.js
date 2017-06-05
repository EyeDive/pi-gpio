const Port = require('./Port').Port;

/**
 * Class IDSD (reserved) type port
 *
 * @author Anthony Maudry <anthony.maudry@eye-dive.com>
 *
 * @license MIT
 */
class Idsd extends Port {
    // GETTERS
    get display() {
        return `IDSD ${this.port}`;
    }
}

module.exports = {
    Idsd: Idsd
};