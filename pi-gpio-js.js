"use strict";
const Gpio = require('./src/Gpio/Gpio').Gpio;
const gpioCommand = require('./src/Gpio/Command').gpioCommand;
const gpioMapper = require('./src/Gpio/Mapping').gpioMapper;

const GpioManager = {
    _gpios: {},
    open: pinNumber => {
        if(isNaN(pinNumber)) {
            throw new Error('pinNumber should be a number');
        }

        if (!GpioManager._gpios.hasOwnProperty(pinNumber)) {
            GpioManager._gpios[pinNumber] = new Gpio(pinNumber);
        }

        return GpioManager._gpios[pinNumber].export();
    },
    close: pinNumber => {
        return new Promise((resolve, reject) => {
            if (GpioManager._gpios.hasOwnProperty(pinNumber)) {
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

module.exports = GpioManager;