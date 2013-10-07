```text
             _                                   _       _     
 ___ _ _ ___| |_ ___ _____       ___ _ _ ___ ___| |_    |_|___ 
|  _| | |_ -|  _| . |     |     | -_| | | -_|   |  _|_  | |_ -|
|___|___|___|_| |___|_|_|_|_____|___|\_/|___|_|_|_| |_|_| |___|
                          |_____|                     |___|    
```

*custom_event.js* is yet another event-driven mirco-framework
based on the publish-subscribe messaging pattern.


### Publish & Subscribe

Subscribers will receive all events published to a topic:

```javascript
_e.on('hello', function(name) { console.log('hello', name); })
```

Publishing an event is easy:

```javascript
_e.emit('hello', 'world')
```

Topics are organized in a tree-based hierarchy using a '/' as path separator.

```javascript
_e.on('/foo/bar/plah', function() { /* ... */ })
```


### Grouping Subscribers

Subscribers can be a simple __function__ _or_ __any javascript object__ _or_ created within __groups__:

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




have fun! -
wolfger@spearwolf.de
2011-2013
