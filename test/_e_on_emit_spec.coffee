should = require 'should'
_e = require "./../src/custom_event"

describe "_e.on() and _e.emit()", ->

    register = foo: 0, bar: 0

    on_foo = _e.on 'on/emit/bar/foo', -> register.foo += 1
    on_bar = _e.on 'on/emit/bar', -> register.bar += 2

    _e.emit '/on/emit/bar/foo'

    it 'should work', ->

        register.foo.should.equal 1
        register.bar.should.equal 0

