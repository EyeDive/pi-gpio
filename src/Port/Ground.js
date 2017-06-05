const Port = require('./Port').Port;

/**
 * Class Ground type port
 *
 * @author Anthony Maudry <anthony.maudry@eye-dive.com>
 *
 * @license MIT
 */
class Ground extends Port {
    // GETTERS
    get display() {
        return `Ground`;
    }
}

module.exports = {
    Ground: Ground
};