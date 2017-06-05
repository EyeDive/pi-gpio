# Class `Map`

`Map` is an abstract class to be extended by the mapping
classes for various cards.

It is published by the lib to be used in case you need
to extend the existing mappings.

It comes with a single static getter returning the map.

## Constructor

The class `Map` is fully static, there is no point to
instantiate it

## Properties

### Public

#### `static` `{Object}` mapping

The Map class throw an Error if not redefined by the
extending class.

That property in extending class should return an object
of key/value pairs. 

Keys are the pin numbers, values a configuration object
for the GPIO port.

ie :

```json
{
    "1": {"type": "Alimentation", "port": "3.3 V"},
    "2": {"type": "Alimentation", "port": "5 V"},
    "3": {"type": "GPIO", "port": 2},
    "4": {"type": "Alimentation", "port": "5 V"},
    "5": {"type": "GPIO", "port": 3},
    "6": {"type": "Ground", "port": null},
    // ...
    "27": {"type": "IDSD", "port": 0},
    // ...
}
```

The configuration object has two keys :
 - __type__ : The type of port. Will be mapped to a Port
 class.
   - `Alimentation` : refers to an alimentation port
   (3.3 V or 5 V)
   - `GPIO` : refers to readable and writable port. The
   one you can use in your programs
   - `Ground` refers to a ground port.
   - `IDSD` refers to an ID_SD port. Those ones are
   reserved but can be used depending on the Pi
   configuation.
 - __port__ : Refers to the port number for a GPIO or
 ID_SD. For alimentaiton it is informative and should
 contain the voltage. For ground it is null.

[<< Back to classes list](../classes.md)