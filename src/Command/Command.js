"use strict";
const fs = require('fs'),
    exec = require('child_process').exec,
    Listener = require('../Listener/Listener');

/**
 * PortCommand class
 *
 * Provides methods wrapping bash commands to read / write Command ports
 *
 * @property _sysPath the path to the gpio class (ie : /sys/class/gpio) depends on the kernel version
 *
 * @author Anthony Maudry <anthony.maudry@eye-dive.com>
 *
 * @license MIT
 */
class PortCommand {
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

    /**
     * Generates a file path from a file name (export, value, direction, etc.) and a GPIO port
     *
     * @param file
     * @param port
     *
     * @returns {string}
     *
     * @private
     */
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
        return (`cat ${this._makeFile(file, port)}`).trim();
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
        if (fs.existsSync(this._makeFile('direction', port))) {
            return this._run(this._makeFileReadCommand('direction', port));
        } else {
            return new Promise(resolve => {
                resolve(null);
            });
        }
    }

    /**
     * Sets the direction of the port from the {Command}._newDirection
     *
     * @param {string} direction
     * @param {Number} port the port from with to get direction
     *
     * @returns {Promise}
     */
    setDirection(direction, port) {
        if (fs.existsSync(this._makeFile('direction', port))) {
            return this._run(this._makeFileWriteCommand(direction, 'direction', port));
        } else {
            return new Promise((resolve, reject) => {
                reject('Can\'t set direction');
            });
        }
    }

    /**
     * Gets the value of the gpio
     *
     * @param {Number} port the port from with to get value
     *
     * @returns {Promise}
     */
    getValue(port) {
        const filePath = this._makeFile('value', port);
        return new Promise((resolve, reject) => {
            if (fs.existsSync(filePath)) {
                fs.readFile(filePath, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data.toString().trim());
                    }
                });
            } else {
                resolve(null);
            }
        });
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
        if (fs.existsSync(this._makeFile('value', port))) {
            return this._run(this._makeFileWriteCommand(value ? '1' : '0', 'value', port));
        } else {
            return new Promise((resolve, reject) => {
                reject('Can\'t set value');
            });
        }
    }

    getPortFilePath(port, file) {
        return this._makeFile(file, port);
    }

    /**
     * Gets an singleton instance of PortCommand
     *
     * @returns {PortCommand}
     */
    static get instance() {
        if (!PortCommand._instance) {
            PortCommand._instance = new PortCommand();
        }

        return PortCommand._instance;
    }
}

const portCommand = PortCommand.instance;

module.exports = {
    portCommand: portCommand
};