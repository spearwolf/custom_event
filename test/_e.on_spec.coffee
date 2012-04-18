should = require 'should'
_e = require "./../custom_event"

#_e.options.trace = yes

describe "_e.on", ->

    it "should return an EventListener", ->

        topic = "hyperion/aphrodite"
        a = _e.on topic, -> true

        should.exist a
        a.should.be.a "object"
        a.eType.should.equal "EventListener"
        a.id.should.be.a "number"
        a.name.should.equal topic
        a.destroy.should.be.a "function"


    it "should execute the callback after emit()", ->

        topic = "hyperion/aphrodite"
        anotherTopic = "kronos/zeus"
        resA = null
        resB = null

        _e.on topic, (val) -> resA = val
        _e.on anotherTopic, (val) -> resB = val

        _e.emit topic, 7

        resA.should.equal 7
        should.not.exist resB

        _e.emit anotherTopic, 9

        resA.should.equal 7
        resB.should.equal 9


    it "should return an EventListener with pause() function", ->

        topic = "hyperion/aphrodite"
        resA = null
        a = _e.on topic, (val) -> resA = val

        a.pause.should.be.a "function"
        should.not.exist resA
        a.pause().should.be.false

        _e.emit topic, 1

        resA.should.equal 1
        a.pause().should.be.false

        a.pause true
        _e.emit topic, 2

        resA.should.equal 1
        a.pause().should.be.true

        a.pause false
        _e.emit topic, 3

        resA.should.equal 3
        a.pause().should.be.false


    it "should return an EventListener with emit() function", ->

        topic = "hyperion/aphrodite"
        resA = null
        a = _e.on topic, (val) -> resA = val

        a.emit.should.be.a "function"
        should.not.exist resA

        _e.emit topic, 1

        resA.should.equal 1

        a.emit 2

        resA.should.equal 2


    it "should return an EventListener with destroy() function", ->

        topic = "hyperion/aphrodite"
        resA = null
        a = _e.on topic, (val) -> resA = val

        a.destroy.should.be.a "function"
        should.not.exist resA

        _e.emit topic, 1

        resA.should.equal 1

        a.destroy()

        should.not.exist a.eType
        should.not.exist a.id
        should.not.exist a.name
        should.not.exist a.destroy
        should.not.exist a.emit
        should.not.exist a.pause

        _e.emit topic, 2

        resA.should.equal 1

