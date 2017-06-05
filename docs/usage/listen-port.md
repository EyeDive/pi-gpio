# Listening a port

This one is quite interesting. It will listen to a GPIO
port. 

When the value changes it will trigger two events
depending on the value :

 - `value:changed` when the value changed. Always
 triggered
 - `value:up` when the value passed from false (down) to
 true (up)
 - `value:down` when the value passed from false (down)
 to true (up)
 
The `changed` event is trigger each time the value
changed. It will be followed by one of the two others
events (`up` ot `fown`) depending on the new state of the
port.
 
 
```javascript
"use strict";
const gpioManager = require('pi-gpio-js');
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
        gpio.on('value:changed', onChange) // .on() and .listen() method are fluent
            .on('value:up', onUp)
            .on('value:down', onDown)
            .listen(); // we listen the port
    });
```
Lets assume we mounted a switch between the 3.3V pin and
GPIO 9 (don't forget the resistor) and pushed it 2 times
while the program was running.

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

[<< back to "usage summary"](./usage.md)

[<- back to "read port"](./read-port.md)
