/**
 * Created by amaud on 03/06/2017.
 */
"use strict";
const fs = require('fs');
const exec = require('child_process').exec;

/**
 * GpioCommand class
 *
 * Provides methods wrapping bash commands to read / write Gpio ports
 *
 * @property _sysPath the path to the gpio class (ie : /sys/class/gpio) depends on the kernel version
 */
class GpioCommand {

    /**
     * Constructor
     */
    constructor() {
        const sysFsPathOld = "/sys/devices/virtual/gpio", // pre 3.18.x kernel
            sysFsPathNew = "/sys/class/gpio"; // post 3.18.x kernel
        if (fs.existsSync(sysFsPathOld)) {
            this._sysPath = sysFsPathOld;
        } else {
            this._sysPath = sysFsPathNew;
        }
    }

    /**
     * Generates a command string to write gpio files. The command is not executed.
     * The gpio param is optional. If setted it will append the directory corresponding to the gpio port
     * to the system path to the gpio directory
     *
     * @param {*} value The value to write
     * @param {string} file The gpio file to write (export, direction, etc.)
     * @param {Number} port [Optional] The gpio port number targetted
     *
     * @returns {string} the command to execute
     *
     * @private
     */
    _makeFileWriteCommand(value, file, port) {
        return (`echo ${value} > ${this._makeFile(file, port)}`).trim();
    }

    _makeFile(file, port) {
        if (!port || isNaN(port)) {
            return `${this._sysPath}/${file}`;
        } else {
            return `${this._sysPath}/gpio${port}/${file}`;
        }
    }

    /**
     * Generates a command string to read a gpio files. The command is not executed.
     * The gpio param is optional. If setted it will append the directory corresponding to the gpio port
     * to the system path to the gpio directory
     *
     * @param {string} file The gpio file to read (export, direction, etc.)
     * @param {Number} port [Optional] The gpio port number targetted
     *
     * @returns {string} the command to execute
     *
     * @private
     */
    _makeFileReadCommand(file, port) {
        if (!port || isNaN(port)) {
            return (`cat ${this._sysPath}/${file}`).trim();
        } else {
            return (`cat ${this._sysPath}/gpio${port}/${file}`).trim();
        }
    }

    /**
     * Runs a command. The sdtout is returned by the resolve of the promised returned.
     * If an error occures the promise is rejected
     *
     * @param {string} command
     *
     * @returns {Promise}
     * @private
     */
    _run(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`EXEC ERROR : ${error}`);
                    reject(error);
                    return;
                }
                if (stderr) {
                    console.error(`EXEC PROCESS ERROR : ${error}`);
                    reject(error);
                    return;
                }

                resolve(stdout.trim());
            });
        });
    }

    /**
     * Command to export a GPIO port. First thing to do before anything.
     *
     * @param {Number} port the port to export
     *
     * @returns {Promise}
     */
    export(port) {
        try {
            fs.accessSync(this._makeFile('value', port));

            return new Promise((resolve, reject) => {
                resolve(null);
            });
        } catch (e) {
            return this._run(this._makeFileWriteCommand(port, 'export', null));
        }
    }

    unexport(port) {
        return this._run(this._makeFileWriteCommand(port, 'unexport', null));
    }

    /**
     * Gets the direction of the port
     *
     * @param {Number} port the port from with to get direction
     *
     * @returns {Promise}
     */
    getDirection(port) {
        return this._run(this._makeFileReadCommand('direction', port));
    }

    /**
     * Sets the direction of the port from the {Gpio}._newDirection
     *
     * @param {string} direction
     * @param {Number} port the port from with to get direction
     *
     * @returns {Promise}
     */
    setDirection(direction, port) {
        return this._run(this._makeFileWriteCommand(direction, 'direction', port));
    }

    /**
     * Gets the value of the gpio
     *
     * @param {Number} port the port from with to get value
     *
     * @returns {Promise}
     */
    getValue(port) {
        return this._run(this._makeFileReadCommand('value', port));
    }

    /**
     * Sets the value of the gpio port from
     *
     * @param {boolean} value
     * @param {Number} port the port from with to get direction
     *
     * @returns {Promise}
     */
    setValue(value, port) {
        return this._run(this._makeFileWriteCommand(value ? '1' : '0', 'value', port));
    }

    /**
     * Watches the value changes for a GPIO port.
     * The onChange callback will be passed two parameters : 'value' and 'port'.
     * 'value' will contain the new port value and 'port' the port number.
     *
     * @param {Number} port the port for with to watch value changes
     * @param {Function} onChange The function to call when the value changes
     */
    watchValue(port, timeout, onChange) {
        const file = this._makeFile('value', port),
            that = this;

        setInterval(() => {

        }, timeout);

        fs.watch(file, (eventType, changedFile) => {
            if (eventType === 'change' && changedFile === file) {
                that.getValue(port)
                    .then(value => {
                        onChange(value, port);
                    })
                    .catch(error => {
                        throw new Error(`WATCH ERROR : could not get value for port ${port}`)
                    });
            }
        });
    }

    /**
     * Stops the watch on value for a port
     *
     * @param port
     */
    unwatchValue(port) {
        const file = this._makeFile('value', port);

        fs.unwatch(file);
    }

    /**
     * Gets an singleton instance of GpioCommand
     *
     * @returns {GpioCommand}
     */
    static get instance() {
        if (!GpioCommand._instance) {
            GpioCommand._instance = new GpioCommand();
        }

        return GpioCommand._instance;
    }
}

const gpioCommand = GpioCommand.instance;

module.exports = {
    gpioCommand: gpioCommand
};