# Writing to a port

This will allow you to change the value of a GPIO port

```javascript
"use strict";
const gpioManager = require('pi-gpio-js');

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

[<< back to "usage summary"](./usage.md)

[<- back to "open/close port"](./open-close-port.md)

[next to "read port" ->](./read-port.md)
