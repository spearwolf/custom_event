should = require 'should'
_e = require "./../custom_event"


describe "_e.pause(<topic>)", ->

    it "should pause all EventListener inside/under a topc", ->

        resA = 0
        resB = 0
        resC = 0
        resD = 0

        a = _e.on 'a', (val) -> resA = val
        b = _e.on 'a/b', (val) -> resB = val
        c = _e.on 'a/c', (val) -> resC = val
        d = _e.on 'a/c/d', (val) -> resD = val

        _e.connect 'x', 'a', 'a/b', 'a/c', 'a/c/d'


        _e.emit 'x', 1

        resA.should.equal 1
        resB.should.equal 1
        resC.should.equal 1
        resD.should.equal 1

        d.is_paused().should.be.false

        _e.pause 'a/c'

        a.is_paused().should.be.false
        b.is_paused().should.be.false
        c.is_paused().should.be.true
        d.is_paused().should.be.true

        _e.emit 'x', 2

        resA.should.equal 2
        resB.should.equal 2
        resC.should.equal 1
        resD.should.equal 1

        _e.pause 'a'

        a.is_paused().should.be.true
        b.is_paused().should.be.true
        c.is_paused().should.be.true
        d.is_paused().should.be.true

        _e.emit 'x', 3

        resA.should.equal 2
        resB.should.equal 2
        resC.should.equal 1
        resD.should.equal 1

        _e.pause 'a', off
        _e.pause 'a/c', off
        _e.pause 'a/b'
        _e.pause 'a/c/d'

        a.is_paused().should.be.false
        b.is_paused().should.be.true
        c.is_paused().should.be.false
        d.is_paused().should.be.true

        _e.emit 'x', 4

        resA.should.equal 4
        resB.should.equal 2
        resC.should.equal 4
        resD.should.equal 1

