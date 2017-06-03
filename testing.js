"use strict";
const gpioManager = require('./pi-gpio-js');

let gpio23;

gpioManager.open(23) // remember ? pin number 23 = GPIO 11
    .then(gpio => {  // the GPIO port is open (exported) lets start using it
        // before reading or writing we need to set the port direction
        // basically 'in' is for reading and 'out' is for writing
        // the .setDirection() method returns a promise, by retuening it
        // we can chain a .then() after this one for the direction
        gpio23 = gpio;
        return gpio.setDirection('in');
    })
    .then(gpio => { // the direction was set. The resolution of the promise gives the same gpio instance
        // here again, .read() returns a promise. Will keep chaining it
        return gpio.read();
    })
    .then(value => { // we finally got the value
        // The value will be a boolean : true for up, false for down
        // the .port readonly propoerty provides the GPIO port number (11 here)
        console.log(`GPIO ${gpio23.port} has the walue ${value}`);
        // we got the value, we can now close the gpio
        gpioManager.close(23);
    })
    .catch(error => { // something went wrong, lets log it
        console.log(error);
    });

let gpio24;

gpioManager.open(24) // we open the newt port witch is... GPIO 8
    .then(gpio => {
        gpio24 = gpio;
        // set the direction to 'out' for writing
        return gpio.setDirection('out');
    })
    .then(gpio => { // we can write the port !
        // .write() accepts a boolean for parameter : true for up dans false for down
        return gpio.write(true);
    })
    .then(result => {
        // lets check the value. Change the direction
        return gpio24.setDirection('in');
    })
    .then(gpio => {
        // read the value
        return gpio.read();
    })
    .then(value => {
        // value should be to true
        if (value === true) {
            console.log(`GPIO ${gpio24.port} is now UP`);
        } else {
            console.log(`Something went wrong with GPIO ${gpio24.port} writting`);
        }
        // now close the port
        gpioManager.close(24);
    })
    .catch(error => {
        console.error(error);
    });

let gpio21;

// Lets define the handlers.
// They will all get one param, being the GPIO instance

// handler for 'changed' event
const onChange = changedGpio => {
    console.log(`GPIO ${changedGpio.port} has changed`);
};
// handler for 'up' event
const onUp = changedGpio => {
    console.log(`GPIO ${changedGpio.port} is now UP`);
};
// handler for 'down' event
const onDown = changedGpio => {
    console.log(`GPIO ${changedGpio.port} is now DOWN`);
};

gpioManager.open(21) // we open the pin number 21 (GPIO 9)
    .then(gpio => {
        // we set a timout of 3s to stop the listening
        setTimeout(() => {
            console.log(`We ran out of time. Lets close now !`);
            // stops the listening
            gpio.unlisten();
            // closes the port
            gpioManager.close(21);
            // in fact the .close() method will defacto stop the listening. But lets keep clear and clean.
        }, 3000);
        // we add listeners to the various events
        gpio.on('changed', onChange) // .on() and .listen() method are fluent
            .on('up', onUp)
            .on('down', onDown)
            .listen(); // we listen the port
    });