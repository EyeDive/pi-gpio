/**
 * Created by amaud on 05/06/2017.
 */
const Map = require('./Map');

/**
 * PiZeroWMap class. Provides the mapping for a Raspberry Pi Zero W
 *
 * @author Anthony Maudry <anthony.maudry@eye-dive.com>
 *
 * @license MIT
 */
class PiZeroWMap extends Map {
    static get mapping() {
        return {
            "1": {"type": "Alimentation", "port": "3.3 V"},
            "2": {"type": "Alimentation", "port": "5 V"},
            "3": {"type": "GPIO", "port": 2},
            "4": {"type": "Alimentation", "port": "5 V"},
            "5": {"type": "GPIO", "port": 3},
            "6": {"type": "Ground", "port": null},
            "7": {"type": "GPIO", "port": 4},
            "8": {"type": "GPIO", "port": 14},
            "9": {"type": "Ground", "port": null},
            "10": {"type": "GPIO", "port": 15},
            "11": {"type": "GPIO", "port": 17},
            "12": {"type": "GPIO", "port": 18},
            "13": {"type": "GPIO", "port": 27},
            "14": {"type": "Ground", "port": null},
            "15": {"type": "GPIO", "port": 22},
            "16": {"type": "GPIO", "port": 23},
            "17": {"type": "Alimentation", "port": "3.3 V"},
            "18": {"type": "GPIO", "port": 24},
            "19": {"type": "GPIO", "port": 10},
            "20": {"type": "Ground", "port": null},
            "21": {"type": "GPIO", "port": 9},
            "22": {"type": "GPIO", "port": 25},
            "23": {"type": "GPIO", "port": 11},
            "24": {"type": "GPIO", "port": 8},
            "25": {"type": "Ground", "port": null},
            "26": {"type": "GPIO", "port": 7},
            "27": {"type": "IDSD", "port": 0},
            "28": {"type": "IDSD", "port": 1},
            "29": {"type": "GPIO", "port": 5},
            "30": {"type": "Ground", "port": null},
            "31": {"type": "GPIO", "port": 6},
            "32": {"type": "GPIO", "port": 12},
            "33": {"type": "GPIO", "port": 13},
            "34": {"type": "Ground", "port": null},
            "35": {"type": "GPIO", "port": 19},
            "36": {"type": "GPIO", "port": 16},
            "37": {"type": "GPIO", "port": 26},
            "38": {"type": "GPIO", "port": 20},
            "39": {"type": "Ground", "port": null},
            "40": {"type": "GPIO", "port": 21}
        };
    }
}

module.exports = PiZeroWMap;