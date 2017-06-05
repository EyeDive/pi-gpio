# Class `GpioManager`

`GpioManager` provides two methods to open or close
ports.

usage :

```javascript
const GpioManager = require('pi-gpio-js').GpioManager;

GpioManager.open(23)
    .then(gpio => {
        // The gpio var holds the opened GPIO instance
        // ... do some magic
        // when you're done close the gpio
        GpioManager.close(23)
            .then(gpio => {
                console.log(`The GPIO ${gpio.port} is closed`); 
            })
            .catch(error => {
                console.error(error);
            });
    }).catch(error => {
        console.error(error);
    });

```

## Constructor

`GpioManager` is an `{Object}` and can't be constructed. The module exports it.

```javascript
const gpioManager = require('pi-gpio-js').GpioManager;

gpioManager.open(23)
    .then(gpio => {
        // the gpio var will contain the Port instance 
    });
```

## Properties

No property for that object

## Events

No event for that object

## Methods

#### `{Promise}` open(`{Number}` pinNumber)

##### Description

Gets the GPIO corresponding to the pin number, exports
and prepare it.

The promise resolves with a `{Port}` instance when the
GPIO is fully usable.

##### Parameters

 - __pinNumber__ (`{Number}`) : The numeral pin number.

#### `{Promise}` close(`{Number}` pinNumber)

##### Description

Gets the GPIO corresponding to the pin number, and 
unexports it.

The promise resolves with a `{Port}` instance when the
GPIO is fully closed.

##### Parameters

 - __pinNumber__ (`{Number}`) : The numeral pin number.
 
 [<< Back to classes list](./classes.md)