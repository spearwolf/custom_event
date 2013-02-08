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

