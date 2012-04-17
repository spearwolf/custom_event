should = require 'should'
_e = require "./../custom_event"

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
        resultA = null
        resultB = null

        _e.on topic, (val) -> resultA = val
        _e.on anotherTopic, (val) -> resultB = val

        _e.emit topic, 7

        resultA.should.equal 7
        should.not.exist resultB

        _e.emit anotherTopic, 9

        resultA.should.equal 7
        resultB.should.equal 9

    it "should return an EventListener with pause() function", ->

        topic = "hyperion/aphrodite"
        resultA = null
        a = _e.on topic, (val) -> resultA = val

        a.pause.should.be.a "function"
        should.not.exist resultA
        a.pause().should.be.false

        _e.emit topic, 1

        resultA.should.equal 1
        a.pause().should.be.false

        a.pause true
        _e.emit topic, 2

        resultA.should.equal 1
        a.pause().should.be.true

        a.pause false
        _e.emit topic, 3

        resultA.should.equal 3
        a.pause().should.be.false

    #it("should return an EventListener with emit() function", function() {

        #var topic = "hyperion/aphrodite",
            #resultA = null,
            #a = _e.on(topic, function(val) { resultA = val; });

        #expect(typeof a.emit).toEqual("function");
        #expect(resultA).toEqual(null);

        #_e.emit(topic, 1);
        #expect(resultA).toEqual(1);
        #a.emit(2);
        #expect(resultA).toEqual(2);
    #});

    #it("should return an EventListener with destroy() function", function() {

        #var topic = "hyperion/aphrodite",
            #resultA = null,
            #a = _e.on(topic, function(val) { resultA = val; });

        #expect(typeof a.destroy).toEqual("function");
        #expect(resultA).toEqual(null);

        #_e.emit(topic, 1);
        #expect(resultA).toEqual(1);

        #a.destroy();
        #expect(typeof a.eType).toEqual("undefined");
        #expect(typeof a.id).toEqual("undefined");
        #expect(typeof a.name).toEqual("undefined");
        #expect(typeof a.destroy).toEqual("undefined");
        #expect(typeof a.emit).toEqual("undefined");
        #expect(typeof a.pause).toEqual("undefined");

        #_e.emit(topic, 2);
        #expect(resultA).toEqual(1);
    #});
