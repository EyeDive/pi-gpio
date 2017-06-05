pi-gpio
=======

Forked from [rakeshpai/pi-gpio](https://github.com/rakeshpai/pi-gpio)

pi-gpio-js is a nodejs library providing tools around
the gpio ports of the Raspberry Pi.

The ports can be used using promise or events.

```javascript
    // load the GPIO manager
    const gpioManager = require('pi-gpio-js').GpioManager;

    let gpio23; // we will store the gpio instance here

    // open a GPIO port
    gpioManager.open(23)
        .then(gpio => {
            // Set the direction to "in" for reading
            gpio23 = gpio;
            return gpio.setDirection(Gpio.DIRECTION_IN)
        })
        // .setDirection returns a promise, we resolve here
        .then(gpio => {
            // read the port
            return gpio.read();
        })
        // .read returns a promise, we resolve here
        .then(readValue => {
            console.log(`GPIO ${gpio23.port} has value ${readValue}`);
            gpioManager.close(23);
        });

```

## How you can help

Ways you can help:

    - Develop mappers for various version of the Pi
    - Review the pull requests and test them on various Pi for correctness.
    - Report Bugs.
    - Fix a bug or add something awesome, Send a pull request.

## About the pin configuration

The pin naming for the raspberry Pi is quite confusing.
It uses the Broadcom naming witch apparently lacks of
logic (at least to me).

The initial library was providing a numeral way to name
the pin. Quite simple : from left to right and from top
to down.

I kept that naming witch has two advantages : it is easy
to count the pins to find the good one and it adds a
layer of abstraction around the pins allowing to map them
for any Broadcom card.

Very valuable information about Raspberry Pi pins can
be found [there](https://fr.pinout.xyz).

Here is the layout for a Raspberry Pi Zero W :

assuming :
 - your looking your card from top (proc visible and pins
 iin 2 vertical columns on your right hand)
 - the 3.3V pin is top left

Don't mind the DIR column. that exemple is a copy/past
of the output of a utility present in library

```
     ___________________________________________
    |     LEFT COLUMN     |     RIGHT COLUMN    |
    |    LEFT | DIR | PIN | PIN | DIR | RIGHT   |
    |    GPIO |     | POS | POS |     | GPIO    |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | 3.3 V   | N/A | 1   |   2 | N/A |     5 V |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 2  | in  | 3   |   4 | N/A |     5 V |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 3  | in  | 5   |   6 | N/A |  Ground |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 4  | in  | 7   |   8 |  in | GPIO 14 |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | Ground  | N/A | 9   |  10 |  in | GPIO 15 |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 17 | in  | 11  |  12 |  in | GPIO 18 |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 27 | in  | 13  |  14 | N/A |  Ground |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 22 | in  | 15  |  16 |  in | GPIO 23 |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | 3.3 V   | N/A | 17  |  18 |  in | GPIO 24 |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 10 | in  | 19  |  20 | N/A |  Ground |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 9  | in  | 21  |  22 |  in | GPIO 25 |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 11 | in  | 23  |  24 |  in |  GPIO 8 |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | Ground  | N/A | 25  |  26 |  in |  GPIO 7 |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | IDSD 0  | N/A | 27  |  28 | N/A |  IDSD 1 |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 5  | in  | 29  |  30 | N/A |  Ground |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 6  | in  | 31  |  32 |  in | GPIO 12 |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 13 | in  | 33  |  34 | N/A |  Ground |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 19 | in  | 35  |  36 |  in | GPIO 16 |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | GPIO 26 | in  | 37  |  38 |  in | GPIO 20 |
    |_________|_____|_____|_____|_____|_________|
    |         |     |     |     |     |         |
    | Ground  | N/A | 39  |  40 |  in | GPIO 21 |
    |_________|_____|_____|_____|_____|_________|

```

## Requirements

### Nodejs 6
```javascript
// @todo : test node instalation on various versions of the Pi
```

pi-gpio-js is initialy developped on the Raspberry Pi 0
and nodejs 6 (witch is a LTS version of node).

To install nodejs 6 on your Raspberry Pi :

```bash
# download the ARMv6 binaries of Nodejs
# Note that the 6 in ARMv6 does not refere to node version
# but to the ARM architechture used by the Pi.
# ie for Nodejs v6.10.3 :
wget https://nodejs.org/dist/v6.10.3/node-v6.10.3-linux-armv6l.tar.xz
# untar
tar xf node-v6.10.3-linux-armv6l.tar.xz
# create simlinks for the node and npm binaries
sudo ln -s /absolute/path/to/node/downlad/node-v6.10.3-linux-armv6l/bin/node /usr/bin/
sudo ln -s /absolute/path/to/node/downlad/node-v6.10.3-linux-armv6l/bin/npm /usr/bin/
# Job's done !
# You have node 6 on your Pi
node -v
# prints "v6.10.3"
npm -v
# prints "3.10.10"
```

Important : That node installation is currently tested
on a Pi 0. I need it to be tested on other versions.
 
## Installation

```
npm install --save pi-gpio-js
```

## Usage

Require the lib's manager :

```javascript
// get the manager
const gpioManager = require('pi-gpio-js').GpioManager;

// open a port ie : 23
gpioManager.open(23)
    .then(gpio => {
        // start the magic  
    });

```

See the [docs](https://github.com/EyeDive/pi-gpio-js/blob/master/docs/index.md)
for more info

## Testing

To run tests: ``npm install && npm test`` where you've got the checkout.

## Developing

You are invited to add mappers and port types or enhance
port types.

Feel free to send pull request ;)

See the [developer docs](https://github.com/EyeDive/pi-gpio-js/blob/master/docs/index.md)
for informations.

## License

(The MIT License)

Copyright (c) 2017 EyeDive <anthony.maudry@eye-dive.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
