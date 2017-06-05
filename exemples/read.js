"use strict"

const gpioManager = require('../pi-gpio-js').GpioManager;

let gpio23, lastValue;

console.log('GPIO reading demo');

gpioManager.open(23)
    .then(gpio => {
        gpio23 = gpio;
        return gpio23.setDirection('in');
    })
    .then(gpio => {
        return gpio23.read();
    })
    .then(value => {
        lastValue = value;
        console.log(`GPIO ${gpio23.port} has value ${value ? 'up' : 'down'}`);
        return gpio23.setDirection('out');
    })
    .then(gpio => {
        console.log(`GPIO ${gpio23.port} with direction ${gpio23.direction} set value to ${!lastValue ? 'up' : 'down'}`);
        return gpio23.write(!lastValue);
    })
    .then(result => {
        return gpio23.setDirection('in');
    })
    .then(gpio => {
        return gpio23.read();
    })
    .then(value => {
        console.log(`GPIO ${gpio23.port} has value ${value ? 'up' : 'down'}`);
        return gpioManager.close(23);
    })
    .then(() => {
        console.log('closed');
    })
    .catch(error => {
        console.error(error);
    });