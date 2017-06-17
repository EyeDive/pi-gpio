const portCommand = require('../Command/Command').portCommand,
    EventEmitter = require('events').EventEmitter;

/**
 * Abstract class Port. Defines methods and properties common to Pi ports.
 *
 * @author Anthony Maudry <anthony.maudry@eye-dive.com>
 *
 * @license MIT
 */
class Port extends EventEmitter{
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

    /**
     * Constructor
     *
     * @param {Number} pinNumber Pin position
     * @param {Number|string} port Broadcom pin name
     */
    constructor(pinNumber, port) {
        super();
        this._pinNumber = pinNumber;
        this._direction = null;
        this._command = portCommand;
        this._port = port;
        this._listenTimer = null;
        this._lastValue = null;
    }

    /**
     * Wether pin is exportable
     *
     * @returns {boolean}
     */
    get exportable() {
        return false;
    }

    /**
     * Wether pin is readable
     *
     * @returns {boolean}
     */
    get readable() {
        return false;
    }

    /**
     * Wether pin is writable
     *
     * @returns {boolean}
     */
    get writable() {
        return false;
    }

    /**
     * The display name of the port
     *
     * @returns {string}
     */
    get display() {
        return `Port ${this.port}`;
    }

    /**
     * The direction of the  port
     *
     * @returns {string|null}
     */
    get direction() {
        return this._direction;
    }

    /**
     * The Broadcom pin number, mapped from the pin position
     *
     * @property
     *
     * @returns {Number}
     */
    get port() {
        return this._port;
    }

    /**
     * The lib pin position
     *
     * @property
     *
     * @returns {Number}
     */
    get pinNumber() {
        return this._pinNumber;
    }

    /**
     * Exports the  port. Needed to read or write it
     *
     * @returns {Promise} resolves with the Port instance
     */
    export() {
        if (!this.exportable) {
            return new Promise((resolve, reject) => {
                reject(`${this.constructor.name} ${this.port} is not exportable.`)
            });
        }
        const that = this;
        return new Promise((resolve, reject) => {
            this._command.export(that.port)
                .then(() => {
                    that.emit('exported', that);
                    resolve(that);
                })
                .catch(reject);
        });
    }

    /**
     * Unexports a port. Do it when your program finishes.
     *
     * @returns {Promise} resolves with the stdout of the export
     */
    unexport() {
        const that = this;
        if (!this.exportable) {
            return new Promise((resolve, reject) => {
                reject(`${this.constructor.name} ${this.port} is not exportable.`);
            });
        }
        this.unlisten();
        return new Promise((resolve, reject) => {
            this._command.unexport(this.port)
                .then(result => {
                    that.emit('unexported', that);
                    resolve(result);
                })
                .catch(reject);
        })
    }

    /**
     * Sets the direction of the port port
     *
     * @param direction
     *
     * @returns {Promise} resolves with the Port instance
     */
    setDirection(direction) {
        const that = this;
        if (!this.exportable) {
            return new Promise((resolve, reject) => {
                reject(`${this.constructor.name} ${this.port} is not changeable.`)
            });
        }
        return new Promise((resolve, reject) => {
            direction = Port.sanitizeDirection(direction);

            this._command.setDirection(direction, that.port)
                .then(() => {
                    return this._command.getDirection(that.port);
                })
                .then(direction => {
                    const oldDirection = that._direction;
                    that._direction = direction;
                    if (that._direction !== oldDirection) {
                        that.emit('direction:changed', that);
                        that.emit(`direction:${that._direction}`, that);
                    }
                    resolve(that);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * Reads the direction
     *
     * @returns {Promise} resolves with the Port instance
     */
    updateDirection() {
        const that = this;

        if (!this.exportable) {
            return new Promise((resolve, reject) => {
                that._direction = -1;
                that.emit('direction:updated', that);
                resolve(that);
            });
        }

        return new Promise((resolve, reject) => {
            this._command.getDirection(that.port)
                .then(direction => {
                    that._direction = direction;
                    that.emit('direction:updated', that);
                    resolve(that);
                })
                .catch(reject);
        });
    }

    /**
     * Reads the value of the  port. To be used the direction must be set to 'Port.DIRECTION_IN'
     *
     * @returns {Promise} resolves with the Port value
     */
    read() {
        const port = this.port;

        if (!this.readable) {
            return new Promise((resolve, reject) => {
                reject(`${this.constructor.name} ${this.port} is not readable.`);
            });
        }

        this._checkDirectionAgainst(Port.DIRECTION_IN);

        return new Promise((resolve, reject) => {
            this._command.getValue(port)
                .then(value => {
                    resolve(value === '1');
                })
                .catch(reject);
        });
    }

    /**
     * Writes the value of the  port. To be used the direction must be set to 'Port.DIRECTION_IN'
     *
     * @param {boolean} value
     *
     * @returns {Promise} resolves with the Port instance
     */
    write(value) {
        if (!this.writable) {
            return new Promise((resolve, reject) => {
                reject(`${this.constructor.name} ${this.port} is not writable.`);
            });
        }

        this._validateWrittenValue(value);

        this._checkDirectionAgainst(Port.DIRECTION_OUT);

        const that = this;

        return new Promise((resolve, reject) => {
            this._command.setValue(value, this.port)
                .then(value => {
                    that._onValueChange(value);
                    resolve(value);
                })
                .catch(reject);
        });
    }

    /**
     * Listens to the value change of a  port.
     *
     * @param interval The interval of value checks in milliseconds.
     *
     * @returns {Port}
     */
    listen(interval) {
        if (!this.readable) {
            return this;
        }
        const that = this;
        let prevValue;
        interval = isNaN(interval) ? 100 : interval;
        this.setDirection(Port.DIRECTION_IN)
            .then(port => {
                return that.read();
            })
            .then(value => {
                prevValue = value;

                that.emit('listen:start', that);
                that._listenTimer = setInterval(() => {
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
     * Stops the listening of the value change for the  port
     *
     * @returns {Port}
     */
    unlisten() {
        if (this._listenTimer !== null) {
            clearInterval(this._listenTimer);
            this._listenTimer = null;
            this.emit('listen:stop', this);
        }

        return this;
    }

    /**
     * Called when the value changed
     *
     * @param value
     *
     * @private
     */
    _onValueChange(value) {
        this.emit('value:changed', this, value);
        if (value) {
            this.emit('value:up', this);
        } else {
            this.emit('value:down', this);
        }
    }

    /**
     * Checks if the Port current direction is matches passed direction
     *
     * @param direction
     *
     * @returns {boolean}
     *
     * @private
     */
    _checkDirectionAgainst(direction) {
        const that = this,
            currentDirection = (() => {
                switch (that.direction) {
                    case Port.DIRECTION_IN :
                        return 'input';
                    case Port.DIRECTION_OUT :
                        return 'output';
                    default :
                        return null;
                }
            })();
        direction = Port.sanitizeDirection(direction);

        if (!this.direction) {
            throw new Error('No direction setted yet !');
        }

        if (this.direction !== direction) {
            throw new Error(` port is set to "${currentDirection}" direction witch is wrong for that action.`);
        }

        return true;
    }

    /**
     * Validates a value passed to the port
     *
     * @param value
     * @private
     */
    _validateWrittenValue(value) {
        if (typeof value !== typeof true) {
            throw new Error('Currently that lib only accepts booleans to write on Port ports');
        }
    }

    // STATIC METHODS
    /**
     * Sanitizes the direction passed as parameter to a constant direction
     *
     * @param direction
     *
     * @returns {string}
     */
    static sanitizeDirection(direction) {
        direction = (direction || "").toLowerCase().trim();
        if (direction === "in" || direction === "input") {
            return Port.DIRECTION_IN;
        } else if (direction === "out" || direction === "output" || !direction) {
            return Port.DIRECTION_OUT;
        } else {
            throw new Error("Direction must be either 'input' ot 'in' for input or 'output' or 'out' for output");
        }
    }
}

module.exports = {
    Port: Port
};