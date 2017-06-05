# Reading a port

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

[<< back to "usage summary"](./usage.md)

[<- back to "write port"](./write-port.md)

[next to "listen port" ->](./listen-port.md)