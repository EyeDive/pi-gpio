# Class `PortMapping`

`PortMapping` is a singleton that maps the lib's numeral
ports to the GPIO ports configuration.

It is published by the lib to be used in case you need
to extend the existing mappings.

## Constructor

The class `PortMapping` is a Singleton. The instance is
directly exported by the module

```javascript
const portMapping = require('/path/to/pi-gpio-js/src/Mapping/Mapping').portMapping;
// portMapping contains the instance
```

## Properties

## Events

No event for that class.

## Methods

### Public

#### `{Port}` mapToPortClass(`Number` pinNumber)

##### Description

Converts a lib's pin number to an instance of a class
extending the `Port` class.

The object return will provide all methods needed to
interact with it.

##### Parameters

 - __pinNumber__ (`{Number}`) : the pin number (1 to 40)

#### `{string}` mapToGpioPort(`Number` pinNumber)

#### Description

Converts a lib's pin number to a Broadcom GPIO port.

##### Parameters

 - __pinNumber__ (`{Number}`) : the pin number to convert

### Private

#### `void` _buildMapping()

##### Description

Builds the mapping from the current revision of the card.

##### parameters

No parameter for that method.

#### `{Number}` _sanitizePinNumber(`{Number}` pinNumber)

##### Description

Checks if the pin number is usable for the current map.

##### properties

 - __pinNumber__ (`Number`) : The pin number to check

[<< Back to classes list](../classes.md)