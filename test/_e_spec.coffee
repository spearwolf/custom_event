should = require 'should'
_e     = require "./../custom_event"

describe "_e", ->

    it "should exist and has a VERSION property", ->

        should.exist _e
        should.exist _e.VERSION


describe "_e API", ->

    it ".eventize()" , -> _e.eventize.should.be.a.Function
    #it ".topic()"    , -> _e.topic.should.be.a.Function
    #it ".slot()"     , -> _e.slot.should.be.a.Function
    #it ".connect()"  , -> _e.connect.should.be.a.Function
    #it ".emit()"     , -> _e.emit.should.be.a.Function
    #it ".on()"       , -> _e.on.should.be.a.Function


describe "_e.eventize( obj ) -> eventizedObj", ->

    obj = {}

    eventizedObj = _e.eventize( obj )

    it "should return obj === eventizedObj"  , -> eventizedObj.should.be.equal obj

    it "obj.on()"                     , -> obj.on.should.be.a.Function
    it "obj.off()"                    , -> obj.off.should.be.a.Function

    it "obj.emit()"                   , -> obj.emit.should.be.a.Function

    it "obj.getSlot()"                , -> obj.getSlot.should.be.a.Function

    it "obj.defineSlot()"             , -> obj.defineSlot.should.be.a.Function
    it "obj.defineSlots()"            , -> obj.defineSlots.should.be.a.Function

    it "obj.freezeSlots()"            , -> obj.freezeSlots.should.be.a.Function
    it "obj.unfreezeSlots()"          , -> obj.unfreezeSlots.should.be.a.Function

    #it "obj.connect()"                , -> obj.connect.should.be.a.Function
