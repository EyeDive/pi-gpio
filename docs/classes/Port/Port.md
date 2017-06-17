# Class `Port`

`Port` is an abstract class to define a Broadcom port.

All port classes implements that class. It provides
properties and methods to manipulate the card ports.

## Constructor

Althoug the class `Port` can be instantiated with `new`
it is recommended to let the `GpioManager` provide the
instances through the `.open()` method as the port will 
be exported and the direction setted.

```javascript
const gpioManager = require('pi-gpio-js').GpioManager;

gpioManager.open(23)
    .then(gpio => {
        // the gpio var will contain the Port instance 
    });
```

## Properties

#### `READONLY` `{boolean}` exportable

Returns `true` if the port can be exported (and then
manipulated)

#### `READONLY` `{boolean}` readable

Returns `true` if the port can be read. Does not check
the direction of the port.

#### `READONLY` `{boolean}` writable

Returns `true` if the port can be written. Does not check
the direction of the port.

#### `READONLY` `{string}` display

Returns a string display of the port. Only informative.

#### `READONLY` `{string}` direction

Returns the last direction fetched.

If a new direction as been checked that property can be
wrong until the new direction has been updated.

The update appends when the direction is actualy changed
in the system after a call of `.setDirection()` and the
promise resolved and when the method
`.updateDirection()` is called and its promise resolved.

#### `READONLY` `{*}` port

Returns the port number of a GPIO or ID_SD port, the
voltage of an Alimentation port or `null` for a Ground
port.

## Events

#### `exported`

Triggered when the port has been actually exported
(opened).

The handler receive the port instance as parameter.

#### `unexported`

Triggered when the port has been actually unexported
(closed).

The handler receive the port instance as parameter.

#### `value:changed`

Triggered when the value of a port has changed.

Triggered only when the `.listen()` method has been
called on the port. It is no more triggered if the
method `.unlisten()` has been called

The handler receive two parameters : the first one is the
port instance, the second one is the new value

#### `value:up`

Triggered when the value of a port has changed and the
new value is `true`.

Triggered only when the `.listen()` method has been
called on the port. It is no more triggered if the
method `.unlisten()` has been called.

The handler receive the port instance as parameter.

#### `value:down`

Triggered when the value of a port has changed and the
new value is `false`.

Triggered only when the `.listen()` method has been
called on the port. It is no more triggered if the
method `.unlisten()` has been called.

The handler receive the port instance as parameter.

#### `direction:changed`

Triggered when the direction actually changed when
calling the method `.setDirection()`.

The handler receive the port instance as parameter.

#### `direction:in`

Triggered when the direction actually changed when
calling the method `.setDirection()` and the new value
is `'in'`.

The handler receive the port instance as parameter.

#### `direction:out`

Triggered when the direction actually changed when
calling the method `.setDirection()` and the new value
is `'out'`.

The handler receive the port instance as parameter.

#### `listen:start`

Triggered when the `.listen()` method is called and the
listening actually start. (After the direction has been
setted).

The handler receive the port instance as parameter.

#### `listen:stop`

Triggered when the `.unlisten()` method is called and the
listening actually stops.

The handler receive the port instance as parameter.

## Methods

### Public

#### `{Promise}` export()

##### Description

Exports the port. Usualy not used as-is as it is done
when calling the `.open()` method of the `GpioManager`.

The promise is resolved with the instance of the port.

##### Parameters

No parameter for that method

#### `{Promise}` unexport()

##### Description

Unexports the port. Usualy not used as-is as it is done
when calling the `.close()` method of the `GpioManager`.

The promise is resolved with the instance of the port.

##### Parameters

No parameter for that method

#### `{Promise}` setDirection(`{string}` direction)

##### Description

Sets the direction of the port. If `'in'` or `'input'`
is passed as argument then the port is readable. If
`'out'` or `'output'` is passed then the port is
writable.

Only GPIO ports will accept that call. Other ports will
trigger an error.

The direction must be set before reading or writting.
When the `.listen()` method is called it automatically
sets the direction to `'in'`.

##### Parameters

 - __direction__ (`string`)

#### `{Promise}` updateDirection()

##### Description

Updates the direction of the port. Generally not used
as-is as the `.open()` method of the `GpioManager`
and calls to `.setDirection` already updates the port
direction.

##### Parameters

No parameter for that method.

#### `{Promise}` read()

##### Description

Reads the value of os GPIO port. The promise is resolved
with the value.

##### Parameters

No parameter for that method.

#### `{Promise}` write(`{boolean}` value)

##### Description

Sets the value of the port. The promise resolves with
the port instance when the value is actually set.

##### Parameters

 - __value__ (`{boolean}`) : the value to set.
 

#### `{Port}` listen(`{Number}` interval)

##### Description

Listen to the changes of value of the port.

When the value changes the `value:changed` event is
triggered. If the new value is `true` (UP) then event
`value:up` is also triggered. If the new value is
`false` (DOWN) then the event `value:down` is triggered.

The listen methods checks the value every 100
milliseconds. That interval can be changed with the
`intrerval` parameter.

##### Parameters

 - __interval__ (`{Number}`) : the interval between
 value checks in milliseconds. Default to 100.

#### `{Port}` on(`{string}` event, `{Function}` handler)

##### Description

Binds a handler to a `Port` event. Multiple handlers
can bin bound to a single event.

##### Parameters

 - __event__ (`{string}`) : The event name to bind to
 - __handler__ -(`{Function}`) : The handler to bind

#### `{Port}` off(`{string}` event, `{Function}` handler)

##### Description

unbinds a handler from a `Port` event.

##### Parameters

 - __event__ (`{string}`) : The event name to unbind
 from
 - __handler__ -(`{Function}`) : The handler to unbind

#### `{Port}` emit(`{string}` event[[, arg1], ...])

##### Description

Triggers an event. All handlers attached to that event
will be called with the arguments following the event.

##### Parameters

 - __event__ (`{string}`) : The event name to unbind
 from
 - __args__ -(`{*}`) : A list of arguments the handlers
 will recieve.
 
[<< Back to classes list](../classes.md)