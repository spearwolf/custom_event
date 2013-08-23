should = require 'should'
_e = require "./../custom_event"

#_e.options.trace = yes

describe "_e.val(<topic>).on(<callback>).destroy()", ->

    it "should destroy on(change) listener but NOT eValue data ..", ->

        a = _e.val "destroy/foo/bar"
        b = _e.val "destroy/foo/bar"

        a(23)
        a().should.equal 23
        b().should.equal 23
        b(42)
        a().should.equal 42
        b().should.equal 42

        x = 0
        onA = a.on (a) -> x = a

        b(55)
        x.should.equal 55

        onA.destroy()
        b(72)

        x.should.equal 55
        a().should.equal 72
        b().should.equal 72

        should.not.exist onA.eType
        should.not.exist onA.id
        should.not.exist onA.name
        should.not.exist onA.destroy


describe "_e.destroy(<topic>)", ->

    it "should destroy anything from and inside topic", ->

        _e.destroy_all()

        res_a = res_b = 0

        a = _e.on 'a', (x) -> res_a = x
        b = _e.on 'b/c', (x) -> res_b = x

        _e.connect 'x', 'a', 'b/c'

        _e.emit 'x', 1

        res_a.should.equal 1
        res_b.should.equal 1

        _e.destroy 'a'

        _e.emit 'x', 2

        res_a.should.equal 1
        res_b.should.equal 2

        _e.destroy '/'

        _e.emit 'x', 3

        res_a.should.equal 1
        res_b.should.equal 2


