var _e = require('../custom_event');


function Foo() {

    _e.eventize(this);

    //this.defineSlot('bar'); -- not needed, implicit called from this.on(..)

    this.on('bar', 'onBar')
        .on('bar', this.onBar);

    this.x = 0;
}

Foo.prototype.onBar = function() {
    ++this.x;
    console.log('onBar, x=', this.x);
};


try {

    var foo = new Foo();
    var plah = _e.eventize({});

    foo.connect('foo', foo, 'bar');
    plah.connect('plah', foo, 'bar');

    foo.emit('bar'); // 1, 2
    foo.emit('foo'); // 3, 4
    plah.emit('plah'); // 5, 6

    foo.off('onBar');

    foo.emit('bar'); // 7

    foo.off('bar');

    foo.emit('bar');
    foo.emit('foo');

    plah.emit('plah'); // 8 ? wrong!

    console.log('foo.x=', foo.x);

} catch (err) {
    console.error('ERROR =>', err.message);
}
