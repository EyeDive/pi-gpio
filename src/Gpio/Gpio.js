/**
 * Created by amaud on 03/06/2017.
 */
"use strict";
const gpioMapper = require('./Mapping').gpioMapper;
const gpioCommand = require('./Command').gpioCommand;

/**
 * Gpio class. Represents a Gpio port
 */
class Gpio {
    // CONSTANTS
    /**
     * The "in" value for ports
     *
     * @returns {string}
     */
    static get DIRECTION_IN() {
        return 'in';
    }

    /**
     * The output value for ports
     *
     * @returns {string}
     */
    static get DIRECTION_OUT() {
        return 'out';
    }

    // CONSTRUCTOR
    /**
     * Constructor
     *
     * @param pinNumber
     * @constructor
     */
    constructor(pinNumber) {
        this._pinNumber = pinNumber;
        this._direction = null;
        this._events = {};
        this._listenTimer = null;
    }

    // GETTERS
    /**
     * The Broadcom pin number, mapped from the pin number
     *
     * @property
     *
     * @returns {Number}
     */
    get port() {
        return gpioMapper.mapToGpioPort(this._pinNumber);
    }

    /**
     * The direction of the Gpio port
     *
     * @returns {string|null}
     */
    get direction() {
        return this._direction;
    }

    // METHODS
    /**
     * Sets the direction of the Gpio port
     *
     * @param direction
     * @returns {Promise}
     */
    setDirection(direction) {
        const that = this;
        return new Promise((resolve, reject) => {
            direction = Gpio.sanitizeDirection(direction);

            gpioCommand.setDirection(direction, that.port)
                .then(() => {
                    return gpioCommand.getDirection(that.port);
                })
                .then(direction => {
                    that._direction = direction;
                    resolve(that);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * Exports the Gpio port. Needed to read or write it
     *
     * @returns {Promise}
     */
    export() {
        const that = this;
        return new Promise((resolve, reject) => {
            gpioCommand.export(that.port)
                .then(() => {
                    resolve(that);
                })
                .catch(reject);
        });
    }

    /**
     * Unexports a port. Do it when your program finishes.
     *
     * @returns {Promise}
     */
    unexport() {
        this.unlisten();
        return gpioCommand.unexport(this.port);
    }

    /**
     * Reads the value of the Gpio port. To be used the direction must be set to 'Gpio.DIRECTION_IN'
     *
     * @returns {Promise}
     */
    read() {
        const port = this.port;
        this._checkDirectionAgainst(Gpio.DIRECTION_IN);

        return new Promise((resolve, reject) => {
            gpioCommand.getValue(port)
                .then(value => {
                    resolve(value === '1');
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * Writes the value of the Gpio port. To be used the direction must be set to 'Gpio.DIRECTION_IN'
     *
     * @param {boolean} value
     * @returns {Promise}
     */
    write(value) {
        if (typeof value !== typeof true) {
            throw new Error('Currently that lib only accepts booleans to write on GPIO ports');
        }

        this._checkDirectionAgainst(Gpio.DIRECTION_OUT);

        return gpioCommand.setValue(value, this.port);
    }

    /**
     * Listens to the value change of a Gpio port.
     *
     * @param interval The interval of value checks in milliseconds.
     *
     * @returns {Gpio}
     */
    listen(interval) {
        const that = this;
        let prevValue;
        interval = isNaN(interval) ? 100 : interval;
        this.setDirection(Gpio.DIRECTION_IN)
            .then(gpio => {
                return that.read();
            })
            .then(value => {
                prevValue = value;

                this._listenTimer = setInterval(() => {
                    that.read()
                        .then(value => {
                            if (value !== prevValue) {
                                prevValue = value;
                                that._onValueChange(value);
                            }
                        })
                        .catch(error => {
                            throw new Error(error);
                        });
                }, interval)
            })
            .catch(error => {
                throw new Error(error);
            });

        return this;
    }

    /**
     * Stops the listening of the value change for the Gpio port
     */
    unlisten() {
        clearInterval(this._listenTimer);
    }

    /**
     * Registers a handler to an event. Handler will be passed parameters depending on event triggered.
     *
     * @param event
     * @param handler
     * @returns {Gpio}
     */
    on(event, handler) {
        if (!this._events.hasOwnProperty(event)) {
            this._events[event] = [];
        }

        if (this._events[event].indexOf(handler) === -1) {
            this._events[event].push(handler);
        }

        return this;
    }

    /**
     * Unregisters a handler from an event.
     *
     * @param event
     * @param handler
     *
     * @returns {Gpio}
     */
    off(event, handler) {
        if (!this._events.hasOwnProperty(event)) {
            return this;
        }

        const index = this._events[event].indexOf(handler);

        if (index !== -1) {
            this._events[event].slice(index, 1);
        }

        return this;
    }

    /**
     * Triggers an event on the Gpio instance.
     *
     * @param event
     * @param args
     *
     * @returns {Gpio}
     */
    trigger(event, ...args) {
        if (!this._events.hasOwnProperty(event)) {
            return this;
        }

        for (let handler of this._events[event]) {
            handler.apply(null, args);
        }

        return this;
    }

    /**
     * Called when the value changed
     *
     * @param value
     * @private
     */
    _onValueChange(value) {
        this.trigger('changed', this);
        if (value) {
            this.trigger('up', this);
        } else {
            this.trigger('down', this);
        }
    }

    /**
     * Checks if the Gpio current direction is matches passed direction
     *
     * @param direction
     * @returns {boolean}
     * @private
     */
    _checkDirectionAgainst(direction) {
        const that = this,
            currentDirection = (() => {
                switch (that.direction) {
                    case Gpio.DIRECTION_IN :
                        return 'input';
                    case Gpio.DIRECTION_OUT :
                        return 'output';
                    default :
                        return null;
                }
            })();
        direction = Gpio.sanitizeDirection(direction);

        if (!this.direction) {
            throw new Error('No direction setted yet !');
        }

        if (this.direction !== direction) {
            throw new Error(`Gpio port is set to "${currentDirection}" direction witch is wrong for that action.`);
        }

        return true;
    }

    // STATIC METHODS
    /**
     * Sanitizes the direction passed as parameter to a constant direction
     *
     * @param direction
     * @returns {string}
     */
    static sanitizeDirection(direction) {
        direction = (direction || "").toLowerCase().trim();
        if (direction === "in" || direction === "input") {
            return Gpio.DIRECTION_IN;
        } else if (direction === "out" || direction === "output" || !direction) {
            return Gpio.DIRECTION_OUT;
        } else {
            throw new Error("Direction must be either 'input' ot 'in' for input or 'output' or 'out' for output");
        }
    }
}

module.exports = {
    Gpio: Gpio
};