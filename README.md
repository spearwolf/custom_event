             _                                   _       _     
 ___ _ _ ___| |_ ___ _____       ___ _ _ ___ ___| |_    |_|___ 
|  _| | |_ -|  _| . |     |     | -_| | | -_|   |  _|_  | |_ -|
|___|___|___|_| |___|_|_|_|_____|___|\_/|___|_|_|_| |_|_| |___|
                          |_____|                     |___|    


custom_event.js is yet another event-driven mirco-framework
based on the publish-subscribe messaging pattern.

Subscribers will receive all events published to a topic:

```javascript
_e.on('hello', function(name) { console.log('hello', name); })
```

Publishing an event is easy:

```javascript
_e.emit('hello', 'world')
´´´

Topics are organized in a tree-based hierarchy using '/' as node separator.

```javascript
_e.on('/foo/bar/plah', function() { /* ... */ })
```



have fun!
wolfger@spearwolf.de
2011-2013
