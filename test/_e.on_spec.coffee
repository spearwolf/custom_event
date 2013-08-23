should = require 'should'
_e = require "./../custom_event"

#_e.options.trace = yes

describe "_e.on(<topic>, <function>)", ->

    describe "should return EventListener", ->

        describe "EventListener API", ->

            TOPIC = "hyperion/aphrodite"

            a = _e.on TOPIC, -> true
            #console.log "EventListener -->", a

            it "should be an object", ->
                should.exist a
                a.should.be.a "object"

            it "eType", -> a.eType.should.equal "EventListener"
            it "id", -> a.id.should.be.a "number"
            it "name", -> a.name.should.equal TOPIC

            it "emit()", -> a.emit.should.be.a "function"
            it "pause()", -> a.pause.should.be.a "function"
            it "destroy()", -> a.destroy.should.be.a "function"


    it "should invoke function after _e.emit(<topic>)", ->

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


    describe "pause()", ->

        it "paused subscriptions should not be invoked", ->

            TOPIC = "hyperion/aphrodite"

            resA = null

            a = _e.on TOPIC, (val) -> resA = val

            a.pause.should.be.a "function"
            should.not.exist resA
            a.pause().should.be.false

            _e.emit TOPIC, 1
            resA.should.equal 1

            #a.pause on
            _e.pause a #, on
            a.pause().should.be.true

            _e.emit TOPIC, 2
            resA.should.equal 1

            #a.pause off
            _e.pause a, off
            a.pause().should.be.false

            _e.emit TOPIC, 3
            resA.should.equal 3


    describe "destroy()", ->

        it "should remove topic subscription", ->

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


