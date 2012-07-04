should = require 'should'
_e = require "./../custom_event"

#_e.options.trace = yes

describe "_e.on(<topic>)", ->

    it "should return an EventListener", ->

        TOPIC = "hyperion/aphrodite"

        a = _e.on TOPIC, -> true

        #console.log "EventListener -->", a

        should.exist a
        a.should.be.a "object"
        a.eType.should.equal "EventListener"
        a.id.should.be.a "number"
        a.name.should.equal TOPIC
        a.destroy.should.be.a "function"


    it "should execute the callback after emit()", ->

        TOPIC = "hyperion/aphrodite"
        OTHER_TOPIC = "kronos/zeus"

        resA = null
        resB = null

        _e.on TOPIC, (val) -> resA = val
        _e.on OTHER_TOPIC, (val) -> resB = val

        _e.emit TOPIC, 7

        resA.should.equal 7
        should.not.exist resB

        _e.emit OTHER_TOPIC, 9

        resA.should.equal 7
        resB.should.equal 9


    it "should return an EventListener with pause() function", ->

        TOPIC = "hyperion/aphrodite"

        resA = null

        a = _e.on TOPIC, (val) -> resA = val

        a.pause.should.be.a "function"
        should.not.exist resA
        a.pause().should.be.false

        _e.emit TOPIC, 1

        resA.should.equal 1
        a.pause().should.be.false

        a.pause on

        _e.emit TOPIC, 2

        resA.should.equal 1
        a.pause().should.be.true

        a.pause off

        _e.emit TOPIC, 3

        resA.should.equal 3
        a.pause().should.be.false


    it "should return an EventListener with emit() function", ->

        TOPIC = "hyperion/aphrodite"

        resA = null

        a = _e.on TOPIC, (val) -> resA = val

        a.emit.should.be.a "function"
        should.not.exist resA

        _e.emit TOPIC, 1

        resA.should.equal 1

        a.emit 2

        resA.should.equal 2


    it "should return an EventListener with destroy() function", ->

        TOPIC = "hyperion/aphrodite"

        resA = null

        a = _e.on TOPIC, (val) -> resA = val

        a.destroy.should.be.a "function"
        should.not.exist resA

        _e.emit TOPIC, 1

        resA.should.equal 1

        a.destroy()

        should.not.exist a.eType
        should.not.exist a.id
        should.not.exist a.name
        should.not.exist a.destroy
        should.not.exist a.emit
        should.not.exist a.pause

        _e.emit TOPIC, 2

        resA.should.equal 1

