/**
 * Created by amaud on 05/06/2017.
 */
"use strict"
/**
 * Abstract class Map
 *
 * @author Anthony Maudry <anthony.maudry@eye-dive.com>
 *
 * @license MIT
 */
class Map {
    static get mapping() {
        throw new Error('Static getter mapping() not set for map')
    }
}

module.exports = Map;