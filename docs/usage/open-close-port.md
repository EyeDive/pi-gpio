
To get the manager :

```javascript
const gpioMoanager = require('pi-gpio-js');
```

To open the GPIO 11 port (witch is the 23rd pin : pin number 23) :

```javascript
gpioManager.open(23)
    .then(gpio => {
        Command
        // ... do your magic !
    })
    .catch(error => {
        // oups ! something went wrong. Maybe the error string will help you
    });
```

To close the same port (port number 11 or pin number 23) :

```javascript
gpioManager.close(11)
    .then(result => {
        // the port is closed (unexported). The result param will be equal to true if port was open before
        // ... do your magic !
    })
    .catch(error => {
        // oups ! something went wrong. Maybe the error string will help you
    });
```

When a port is open, you can change its direction.

A port accepts two direction : `'in'` (or `'input'`) for
reading and `'out'` or `'output'` for writing.

When your port is opened :

```javascript
gpioManager.open(23)
    .then(gpio => {
        // Sets the direction to "in" as we want to read
        gpio.setDirection('in')
            .then(gpio => { // the promise is resolved with the changed GPIO
                // read it
                gpio.read();
            });
    }); // not a good practive not to catch ;)
```

[<< back to "usage summary"](./usage.md)

[-> next to "write port"](./write-port.md)