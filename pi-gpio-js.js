"use strict";
/**
 * Module defining a PortManager to open or close ports. it also exports :
 *  - Ports : a list of Ports classes
 *  - MapSelector : a Ports map selector on witch can be added any pother mapping
 *  - Map : The abstract class Map to define built-in mappings
 *  - Port : The abstract class Port to define built-in ports
 */


const portMapper = require('./src/Mapping/Mapping').portMapper;
const Ports = require('./src/Port/Ports');
const MapSelector = require('./src/Mapping/MapSelector');
const Map = require('./src/Mapping/Map/Map');
const Port = require('./src/Port/Port');

const GpioManager = {
    _gpios: {},
    open: pinNumber => {
        if (isNaN(pinNumber)) {
            throw new Error('pinNumber should be a number');
        }

        if (!GpioManager._gpios.hasOwnProperty(pinNumber)) {
            GpioManager._gpios[pinNumber] = portMapper.mapToPortClass(pinNumber);
        }

        return new Promise((resolve, reject) => {
            const gpio = GpioManager._gpios[pinNumber];
            if (gpio.exportable) {
                gpio.export()
                    .then(gpio => {
                        return gpio.updateDirection();
                    })
                    .then(resolve)
                    .catch(reject);
            } else {
                resolve(gpio);
            }
        });
    },
    close: pinNumber => {
        return new Promise((resolve, reject) => {
            if (GpioManager._gpios.hasOwnProperty(pinNumber) && GpioManager._gpios[pinNumber].exportable) {
                GpioManager._gpios[pinNumber].unexport()
                    .then(() => {
                        resolve(true);
                    })
                    .catch(reject);
            } else {
                resolve(false);
            }
        });
    }
};

module.exports = {
    GpioManager: GpioManager,
    Ports: Ports,
    MapSelector: MapSelector,
    Map: Map,
    Port: Port
};