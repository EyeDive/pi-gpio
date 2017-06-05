# pi-gpio-js documentation

Welcome. And thank you to have gone so far in the repo !

pi-gpio-js is a fork of [rakeshpai/pi-gpio](https://github.com/rakeshpai/pi-gpio).

It has been tested on a Raspberry Pi 0 with nodejs 6.

## Installation

refere to the [README](https://github.com/EyeDive/pi-gpio-js/blob/master/README.md#installation).

## How it works

Basically requiring the library will provide you with a
[{GpioManager}](classes/GpioManager.md) instance.

That manager comes with two methods : `.open()` and `.close()` witch, well... open
or close GPIO ports.

Each method returns a Promise. The `.open()` method, when the promise is resolved,
provides a [{Port}](./classes/Port/Port.md) object instance witch has its own methods to read or write it.

The Broadcom chip has its own terminology for pin numbers. The library tries to simplify that.

I distinguish :
 - _GPIO number_ : The Broadcom pin numbers. Witch are totaly not understandable nor logical (to me at least)
 - _pin number_ : The index of the pins when counting from left to right and top to down, logical and
 simple (to me again)
 
the `.open()` method uses the `pin numbers`.

## Usage

 - [Usage summary](./usage/usage.md)
    - [Open and close ports](./usage/open-close-port.md)
    - [Write ports](./usage/write-port.md)
    - [Read ports](./usage/read-port.md)
    - [Listen ports](./usage/listen-port.md)

There are 3 usages for the library : read, write or listen a port.


## Classes

Classes documentation available
[here](./classes/classes.md)

## Developers

A doc for developers is comming soon. During the wait you
can check the [classes documentation](./classes/classes.md)

## Issues and demands

The issue tracker is
[here](https://github.com/EyeDive/pi-gpio-js/issues).

This is also the place to post demands.

## Thank You

That's all for now. Thank you for getting so far.

If you 

