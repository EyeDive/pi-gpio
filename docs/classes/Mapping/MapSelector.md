# Class `RevisionMapSelector`

`RevisionMapSelector` is a singleton that is both a
repository for maps and a helper to select the map
corresponding to the current card revision.

It is published by the lib to be used in case you need
to extend the existing mappings.

## Constructor

The class `RevisionMapSelector` is a Singleton. The
instance is directly exported by the module

```javascript
const mapRevision = require('/path/to/pi-gpio-js/src/Mapping/MapSelector').portMapping;
// portMapping contains the instance
```

## Properties

No public property for that class

## Events

No event for that class.

## Methods

### Public

#### `{Map}` getMapForCurrentRevision()

##### Description

Gets the Mapping class built for the revision of the Pi
xhere the program runs.

##### Parameters

No parameter for that method.

#### `void` addMapForRevision(`string` revision, `Map` map, `{boolean}` force)

#### Description

Adds a Map class for a particular revision. Usefull to
add built-in maps to a program that could run on multiple
revisions.

##### Parameters

 - __revision__ (`{string}`) : The revision number for
 witch the map has been built.
 - __map__ (`Map`) : A class extending the Map class.
 - __force__ (`{boolean}`) : If a map exists for the
 wanted revision it will result in an error. If force
 is true the map is set without error.

### Private

#### `void` __loadRevisions()

##### Description

Loads all the revisions of the lib.

##### parameters

No parameter for that method.

[<< Back to classes list](../classes.md)