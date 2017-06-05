# Class `PortCommand`

`PortCommand` is an internal class that executes system
commands to manipulate the ports.

It is not published by the lib but may be useful for
developers willing to enhance the lib.

## Constructor

The class `PortCommand` is a Singleton. The instance is
directly exported by the module

```javascript
const portCommand = require('/path/to/pi-gpio-js/src/Command/Command').portCommand;
// portCommand contains the instance
```

## Properties

### Public

No public property for this method

### Private

#### `{string}` _sysPath

Contains the absolute path to the gpio directory. This
directory contains all the directories and files needed
to manipulate the ports.

## Events

No event for that class.

## Methods

### Public

#### `{Promise}` export(`Number` port)

##### Description

Command to export a GPIO port. First thing to do before
anything. The promise resolves with the stdout of the
export command.

##### Parameters

 - __port__ (`{Number}`) : the port to export

#### `{Promise}` unexport(`Number` port)

#### Description

Command to unexport a GPIO port. The promise resolves
with the stdout of the unexport command.

##### Parameters

 - __port__ (`{Number}`) : the port to unexport

#### `{Promise}` getDirection(`Number` port)

#### Description

Gets the direction of the port. The promise resolves with
a `string` being `'in'` or `'out'`

##### Parameters

 - __port__ (`{Number}`) : the port to get description

#### `{Promise}` setDirection(`string` direction, `Number` port)

#### Description

Sets the direction of the port. The promise resolves with
the stdout of the command.

##### Parameters

 - __direction__ (`{string}`) : the direction to set
 - __port__ (`{Number}`) : the port to change

#### `{Promise}` getValue(`Number` port)

#### Description

Gets the value of the port if its direction is `'in'`.
The promise resolve with the value being `'1'` or `'0'`.

##### Parameters

 - __port__ (`{Number}`) : the port to change


#### `{Promise}` setDirection(`string` direction, `Number` port)

#### Description

Sets the value of the port. The promise resolves with
the stdout of the command.

##### Parameters

 - __value__ (`{string}`) : the value to set
 - __port__ (`{Number}`) : the port to change

### Private

#### `{string}` _makeFile(`{string}` file, `{Number}` port)

##### Description

Generates and returns a file path from a file name
(`export`, `value`, `direction`, etc.) and a GPIO port.

##### properties

 - __file__ (`string`) : The name of the targetted gpio
 file. Can be either : `export`, `value`, `direction`,
 etc.
 - __port__ (`Number`) : The Broadcom number of the pin.
 If given will prepend the pin dir (ie `gpio11`).
 Used for port specific files : `direction`, `value`,
 etc.

#### `{string}` _makeFileWriteCommand(`{*}` value, `{string}` file [, `{Number}` port])

##### Description

Generates and returns a command string to write gpio
files. The command is not executed.

##### properties

 - __value__ (`string` or `Number`) : the value to be
 written to the file
 - __file__ (`string`) : The name of the gpio file to
 write. Can be either : `export`, `value`, `direction`,
 etc.
 - __port__ (`Number`) : The Broadcom number of the pin.
 If given will prepend the pin dir (ie `gpio11`).
 Used for port specific files : `direction`, `value`,
 etc.

#### `{string}` _makeFileReadCommand(`{string}` file, `{Number}` port)

##### Description

Generates and return a command string to read a gpio
file. The command is not executed.

##### properties

 - __file__ (`string`) : The name of the gpio file to
 read. Can be either : `export`, `value`, `direction`,
 etc.
 - __port__ (`Number`) : The Broadcom number of the pin.
 If given will prepend the pin dir (ie `gpio11`).
 Used for port specific files : `direction`, `value`,
 etc.

#### `{Promise}` _run({string}` command)

##### Description

Runs a command. The sdtout is returned by the resolve of
the promised returned.

If an error occures the promise is rejected.

##### properties

 - __command__ (`string`) : The command to run.

##### exemple

```javascript
// in the gpioCommand class
this._run('echo 1')
    .then(stdout => {
        console.log(`run stdout is ${stdout}`);
    })
    .catch(error => {
        console.error(error);
    });
```

will print : 

```
1
```

[<< Back to classes list](../classes.md)