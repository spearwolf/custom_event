console.info('Welcome to custom_event.js playground');

_E.options.skipRecursionCheck = true;

_E.on("call/**", function(name) {
    console.debug("call:", name);
});

_E.on("foo/bar", function() {
    console.debug("foo/bar");
    _E.emit("call/first");
});

_E.connect("foo/bar", "call/second");

_E.emit("foo/bar");


//_E.on("**", function() {
    //console.debug("event '" + this.name + "'");
//});

//_E.on("foo/*", function() {
    //console.debug("A foo/* -> (", this.name, ")", arguments);
//});

//_E.on("foo/*", function() {
    //console.debug("B foo/* -> (", this.name, ")", arguments);
//});

//_E.on("foo/bar", function() {
    //console.debug("foo/bar -> (", this.name, ")", arguments);
//});

//_E.once("foo/*", function() {
    //console.debug("foo/* -> (", this.name, ")", arguments, "bye.");
//});

//_E.on("foo/bar/plah", function() {
    //console.debug("foo/bar/plah -> (", this.name, ")", arguments);
//});

//console.debug(_E._rootNode);

//on('foo/*', function () {
    //console.info('triggerd:', this.name);
//});

//on('foo/**', function () {
    //console.info("I'll get all foo's:", this.name);
//});

//on('foo/bar/dumdidum', function (a, b) {
    //console.info('zzing!', a, b);
//});

//on('random/number', function () {
    //return Math.random();
//});

//emit('foo');
//emit('foo/bar');
//emit('foo/bar/dumdidum', 'zong!', 'zzang!!');
//emit('foo/foo/');
//emit('*/foo');
//emit('*/*', function () {
    //console.log('got', arguments.length, 'results:');
    //for (var i = 0; i < arguments.length; i++) {
        //console.log(i+' =>', arguments[i]);
    //}
//});

_E.options.debug = true;


//_E.on("foo/xyz:changed", function(xyz){ console.log("xyz is", xyz); });

//_E.set("foo/xyz", 23);

//_E.get("foo/xyz");

/*
fooMod = _E.Module("/foo/mod", {
    
    _init: function() { 
        console.log("_init", this); 
        this.a = 11; 
    },

    'on foo': function() { console.log("yippie"); },
    'on bar': function(x) { console.log("bar:", x); },

    'on hello ..': function(forename, lastname) {
      console.log(this.name, this.pathArgs, 'hello "' + forename + ' ' + lastname + '"', "arguments: ", arguments);
    },

    //plah: 'out',
   
    'on a': function(n) { 
        var b = this.a;
        console.log("a =", b, this);
        this.a = n;
        return b;
    },

    'module sub': {
        'on foo': function() { console.log("subversiv", arguments); }
    }
});
*/

_E.options.debug = false;

