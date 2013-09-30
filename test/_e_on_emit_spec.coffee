should = require 'should'
_e = require "./../src/custom_event"

describe "_e.on() and _e.emit()", ->

    register = foo: 0, bar: 0, plah: 0, doa: 0

    on_foo = _e.on 'on/emit/bar/foo', -> register.foo += 1
    on_bar = _e.on 'on/emit/bar', -> register.bar += 2

    on_plah = _e.on 'on/emit/bar',
        plah: (-> register.plah += 3 )
        deep:
            doa: (-> register.doa += 4 )

    #console.log('EMIT', '/on/emit/bar/foo')
    _e.emit '/on/emit/bar/foo'

    #console.log('EMIT', '/on/emit/bar')
    _e.emit '/on/emit/bar'

    #console.log('EMIT', '/on/emit/bar/plah')
    _e.emit '/on/emit/bar/plah'

    #_e.rootNode.findOrCreate '/on/emit/bar/deep/doa'

    #console.log('EMIT', '/on/emit/bar/deep/doa')
    _e.emit '/on/emit/bar/deep/doa'

    it 'should work', ->

        register.foo.should.equal 1
        register.bar.should.equal 2
        register.plah.should.equal 3
        register.doa.should.equal 4

