"use strict";

const gpioManager = require('../pi-gpio-js').GpioManager,
    gpioMapper = require('../src/Mapping/Mapping').portMapper,
    readLine = require('readline'),
    NB_GPIOS = 40,
    gpios = {};
let finishedGpios = 0;

const CLI = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

readLine.cursorTo(CLI.output, 0,0);
readLine.clearScreenDown(CLI.output);
CLI.write('Presents all GPIOs ports status !\n');
CLI.write('\n');

function openGpio(pin) {
    const pinNumber = pin;
    appendToArray({
        "gpio" : 'Pending',
        "dir" : '?',
        "pin" : pinNumber
    }, pinNumber);
    gpioManager.open(pinNumber)
        .then(gpio => {
            appendToArray({
                "gpio" : gpio.display,
                "dir" : gpio.direction ? gpio.direction : 'N/A',
                "pin" : pinNumber
            }, pinNumber);
            return gpioManager.close(pinNumber);
        })
        .then(result => {
            finishedGpios ++;
            if (finishedGpios >= NB_GPIOS) {
                drawBottom();
            }
        }).catch(error => {
            appendToArray({
                "gpio" : error,
                "dir" : `${gpioMapper.mapToGpioPort(pinNumber)}`,
                "pin" : pinNumber
            }, pinNumber);
        }).catch(error => {
            appendToArray({
                "gpio" : error,
                "dir" : 'C',
                "pin" : pinNumber
            }, pinNumber);
        });
}

function openWrongGpio(pin) {
    appendToArray({
        "gpio" : 'N/A',
        "dir" : 'N/A',
        "pin" : pin
    }, pin);
}

function appendToArray(config, pin) {
    gpios[pin - 1] = config;
    drawGpio(pin);
}

function drawText(text, width, align) {
    text = ` ${text} `; // add spaces around
    let diff = width - text.length;
    diff = diff > 0 ? diff : 0;
    return align === 'left'
        ? `${text}${(' ').repeat(diff)}`
        : `${(' ').repeat(diff)}${text}`;
}

function getGpioConfig(pin) {
    try {
        gpioMapper.mapToGpioPort(pin);
        openGpio(pin);
    } catch (e) {
        openWrongGpio(pin);
    }
}

function drawGpioLine(gpioConfig, align) {
    return align === 'left'
        ? `|${drawText(gpioConfig.gpio, 9, align)}|${drawText(gpioConfig.dir, 5, align)}|${drawText(gpioConfig.pin, 5, align)}|`
        : `${drawText(gpioConfig.pin, 5, align)}|${drawText(gpioConfig.dir, 5, align)}|${drawText(gpioConfig.gpio, 9, align)}|`
}

function drawGpio(pin) {
    if ((pin % 2) === 0) {
        pin--;
    }
    if (gpios.hasOwnProperty(pin - 1) && gpios.hasOwnProperty(pin)) {
        readLine.cursorTo(CLI.output, 0,  getPinLine(pin));
        CLI.write('    |         |     |     |     |     |         |\n');
        CLI.write(`    ${drawGpioLine(gpios[pin - 1], 'left')}${drawGpioLine(gpios[pin], 'right')}\n`);
        CLI.write('    |_________|_____|_____|_____|_____|_________|\n');
    }
}

function drawGpios() {
    CLI.write('     ___________________________________________ \n');
    CLI.write('    |     LEFT COLUMN     |     RIGHT COLUMN    |\n');
    CLI.write('    |    LEFT | DIR | PIN | PIN | DIR | RIGHT   |\n');
    CLI.write('    |    GPIO |     | POS | POS |     | GPIO    |\n');
    CLI.write('    |_________|_____|_____|_____|_____|_________|\n');
}

function getPinLine(pin) {
    // [7 lines before] + [pin INDEX] * [3 lines by pin / 2 (2 pins per line)]
    return 7 + (pin - 1) * 1.5;
}

function goToBottom() {
    readLine.cursorTo(CLI.output, 0,  getPinLine(NB_GPIOS - 1) + 3);
}

function drawBottom() {
    goToBottom();
    CLI.write('\n');
    CLI.write('    Hit "q" or "quit" then [enter] to quit\n');
    CLI.on('line', input => {
        input = input.trim();
        if (input === 'q' || input === 'quit') {
            CLI.write('\n');
            CLI.write('    Goodbye\n');
            CLI.close();
        }
    });
}

drawGpios();

for(let i = 1; i <= NB_GPIOS; i ++) {
    getGpioConfig(i);
}