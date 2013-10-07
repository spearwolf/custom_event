```text
             _                                   _       _     
 ___ _ _ ___| |_ ___ _____       ___ _ _ ___ ___| |_    |_|___ 
|  _| | |_ -|  _| . |     |     | -_| | | -_|   |  _|_  | |_ -|
|___|___|___|_| |___|_|_|_|_____|___|\_/|___|_|_|_| |_|_| |___|
                          |_____|                     |___|    
```

*custom_event.js* is yet another event-driven micro-framework
based on the publish-subscribe messaging pattern.


### Publish & Subscribe

Subscribers will receive all messages published to a topic:

```javascript
_e.on('hello', function(name) { console.log('hello', name); })
```

Publishing messages is super-simple:

```javascript
_e.emit('hello', 'world')
```

Topics are organized in a tree-like hierarchy using a '/' as path separator.

```javascript
_e.on('/foo/bar/plah', function() { /* ... */ })
```


### Grouping Subscribers

Subscribers can be a __function__ _or_ __any javascript object__ _or_ created within __groups__:

```javascript

// just a simple function as subscriber
_e.on('/foo/bar/plah', function() {})

// using an object as subscriber
_e.on('/foo/bar', {

    'plah': function() { /* '/foo/bar/plah' */ },
    
    deep: {
        deeper: {
            'plah': function() { /* '/foo/bar/deep/deeper/plah' */ }
        }
    }
})

// using the grouping api
_e.group('my/module/foo', function(foo) {
    foo.on('foo', function() { /* '/my/module/foo/foo' */ });
    foo.on('bar', function() { /* '/my/module/foo/bar' */ });
})

```


### Subscriber Parameters

All message parameters will be passed on to subscribers.

```javascript
_e.on('foo/bar', function(a, b, c) { console.log('a:', a, 'b:', b, 'c:', c); })

_e.emit('foo/bar', 1, 2, 3);
```


### Subscriber API

If a subscriber is created you will get an object
which contains the subscriber api as result.

```javascript
bar = _e.on('foo/bar', function(){ /* ... */ })

plah = _e.group('foo/plah', { /* ... */ })  // works also for groups
```

#### isPaused

Boolean property. Indicates if the subscriber is active (receives messages) or not.

```javascript
console.log( plah.isPaused )   // => "false"
```

#### setPause(pause)

Enables/disables pause state.

```javascript
plah.setPause(true)

console.log( plah.isPaused )   // => "true"
```

#### destroy()

Destroy subscriber. No messages will be received in future. All properties will be removed.

```javascript
plah.destroy()

plah.setPause(true)  // will throw an Error -> setPause() is undefined
```



have fun! -
wolfger@spearwolf.de
2011-2013
