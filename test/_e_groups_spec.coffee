should = require 'should'
_e = require "./../src/custom_event"

describe "custom_event groups", ->

    register = foo: 0, bar: 0, plah: 0, doa: 0

    group = _e.group 'group/emit'
    console.log('e ->', group)

    on_foo = group.on 'bar/foo', -> register.foo += 1
    on_bar = group.on 'bar', -> register.bar += 2

    on_plah = group.on 'bar',
        plah: (-> register.plah += 3 )
        deep:
            doa: (-> register.doa += 4 )

    #console.log('EMIT', '/on/emit/bar/foo')
    _e.emit '/group/emit/bar/foo'

    #console.log('EMIT', '/on/emit/bar')
    group.emit 'bar'

    #console.log('EMIT', '/on/emit/bar/plah')
    _e.emit '/group/emit/bar/plah'

    #_e.rootNode.findOrCreate '/on/emit/bar/deep/doa'

    #console.log('EMIT', '/on/emit/bar/deep/doa')
    #_e.emit '/group/emit/bar/deep/doa'
    _e.group('group').group('emit/bar').emit 'deep/doa'

    it 'should work', ->

        register.foo.should.equal 1
        register.bar.should.equal 2
        register.plah.should.equal 3
        register.doa.should.equal 4

        group.clear()
        _e.emit 'group/emit/bar'
        register.bar.should.equal 2

