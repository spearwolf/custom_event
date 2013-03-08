var Benchmark = require('benchmark')
  , _e = require('./custom_event-min')
  ;

var suite = new Benchmark.Suite();


// ================================
// setup
// ================================

function foo(x) { /* ntdh */ }

var on_foo = _e.on('foo', foo);
_e.on('bar/foo', foo);
_e.on('plah/bar/foo', foo);




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
.add('on_foo.emit(23)', function() {

  on_foo.emit(23);

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


