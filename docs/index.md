# pi-gpio-js documentation

Welcome. And thank you to have gone so far in the repo !

pi-gpio-js is a fork of [https://github.com/rakeshpai/pi-gpio](rakeshpai/pi-gpio).

It has been tested on a Raspberry Pi 0 with nodejs 6.

## Installation

refere to the [](README).

## How it works

Basically requiring the library will provide you with a [](<GpioManager>) instance.

That manager comes with two methods : `.open()` and `.close()` witch, well... open
or close GPIO ports.

Each method returns a Promise. The `.open()` method, when the promise is resolved,
provides a [](<Gpio>) object instance witch has its own methods to read or write it.

The Broadcom chip has its own terminology for pin numbers. The library tries to simplify that.

I distinguish :
 - _GPIO number_ : The Broadcom pin numbers. Witch are totaly not understandable nor logical (to me at least)
 - _pin number_ : The index of the pins when counting from left to right and top to down, logical and
 simple (to me again)
 
the `.open()` method uses the `pin numbers`.

## Usage

To get the manager :

```javascript
const gpioMoanager = require('pi-gpio-js');
```

To open the GPIO 11 port (witch is the 23rd pin : pin number 23) :

```javascript
gpioManager.open(23)
    .then(gpio => {
        // the port is open (exported). the gpio parameter contains the Gpio instance
        // ... do your magic !
    })
    .catch(error => {
        // oups ! something went wrong. Maybe the error string will help you
    });
```

To close the same port (port number 11 or pin number 23) :

```javascript
gpioManager.close(11)
    .then(result => {
        // the port is closed (unexported). The result param will be equal to true if port was open before
        // ... do your magic !
    })
    .catch(error => {
        // oups ! something went wrong. Maybe the error string will help you
    });
```

There are 3 usages for the library : read, write or listen a port.

### Reading

This will provide the current value in a port.

```javascript
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

```

Will result in (if the port was DOWN) :

```
GPIO 11 has the value false
```

or (if the port was UP)

```
GPIO 11 has the value true
```

### Writing

This will allow you to change the value of a GPIO port

```javascript
"use strict";
const gpioManager = require('./pi-gpio-js');

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
```

Will result in :

```
GPIO 8 is now UP
```

### Listening

This one is quite interresting. It will listen to a GPIO port. 

When the value changes it will trigger two events depending on the value :

 - `changed` when the value changed. Always triggered
 - `up` when the value passed from false (down) to true (up)
 - `down` when the value passed from false (down) to true (up)
 
The `changed` event is trigger each time the value changed. It will be followed by one of the
two others events (`up` ot `fown`) depending on the new state of the port.
 
 
```javascript
"use strict";
const gpioManager = require('./pi-gpio-js');
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
            console.log('We ran out of time. Lets close now !');
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
```

Lets assume we mounted a switch between the 3.3V pin and GPIO 9 (don't forget the resistor)
and pushed it 2 times while the program was running.

Will result in :

```
GPIO 9 has changed
GPIO 9 is new UP
GPIO 9 has changed
GPIO 9 is new DOWN
GPIO 9 has changed
GPIO 9 is new UP
GPIO 9 has changed
GPIO 9 is new DOWN
We ran out of time. Lets close now !
```

In fact, the `.listen()` method checks the value of the port each 100ms. That interval
can be changed as the method accepts an interval in milliseconds as first parameter.

ie :
```javascript
gpio.listen(); // default interval of 100ms -> accurate enough and my Pi did not burn yet
gpio.listen(500); // will set the interval to 500ms -> less accurate but better for the Pi's charge
gpio.listen(10); // will set the interval to 10ms -> more accurate but don't shout at me if your Pi burst in flames !
```

## Thank You

This doc is done. Thank you for reading.

You got the main functions of the lib. A more complete doc is to come.

