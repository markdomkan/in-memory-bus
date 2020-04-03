# JsEvents

## Usage

```js
const JsEvents = require('@markdomkan/js-events');
```

or ES6 & TS

``` ts
import JsEvents from '@markdomkan/js-events';
```

You can extend a class with JsEvents

``` js
class MyClass extends JsEvents{
    constructor(){
        this.on('myCustomEvent', name => console.log(name));
    }

    triggerMyCustomEvent(){
        this.emit('myCustomEvent','Hello World');
    }
}
```

or use as Object. Also can pass an object to class constructor to inject the methods on the object.

``` js
customObject = new JsEvents(customObject);
customObject.on('myCustomEvent', name => console.log(name));
customObject.emit('myCustomEvent','Hello World');
```

## Avaiable Methods
### Subscribe new event
``` js
on(eventName, callbackFunction): this;
```

### Emit event with optional object data
``` js 
emit(eventName: string, data?: any): this; 
 ```

### Unsubscribe event
``` js 
delete(eventName: string): this; 
```

### Get all subcrited event names
``` js 
emitters(): string[]; 
```

### Get all callbacks by event name
``` js 
listeners(eventName: string): (data: any) => void; 
```

### Check if exist passed event
``` js 
hasListeners(eventName: string): boolean; 
```