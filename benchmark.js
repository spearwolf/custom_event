var Benchmark = require('benchmark')
  , _e = require('./custom_event.min')
  ;

var suite = new Benchmark.Suite();


// ================================
// setup
// ================================

function foo(x) { /* ntdh */ }

var on_foo = _e.on('foo', foo);
_e.on('bar/foo', foo);
_e.on('plah/bar/foo', foo);
//_e.connect('/fooAlias', '/foo');
//_e.connect('/plahBarFooAlias', 'plah/bar/foo');




// ================================
// tests
// ================================
suite.add('_e.emit("foo", 23)', function() {

    _e.emit('foo', 23);

})
.add('_e.emit("/foo", 23)', function() {

    _e.emit('/foo', 23);

})
.add('_e.emit("bar/foo", 23)', function() {

    _e.emit('bar/foo', 23);

})
.add('_e.emit("plah/bar/foo", 23)', function() {

    _e.emit('plah/bar/foo', 23);

})
//.add('on_foo.emit(23)', function() {

  //on_foo.emit(23);

//})
.add('_e.emit("/foo")', function() {

    _e.emit('/foo');

})
.add('_e.emit("/fooAlias")', function() {

    _e.emit('/fooAlias');

})
.add('_e.emit("/plahBarFooAlias")', function() {

    _e.emit('/plahBarFooAlias');

})
.add('foo(23)', function() {

    foo(23);

})
// ================================
// listeners
// ================================
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// ================================
// run
// ================================
.run({ 'async': true });

