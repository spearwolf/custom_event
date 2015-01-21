should = require 'should'
_e     = require "./../custom_event"

describe "_e", ->

    it "should exist and has a VERSION property", ->

        should.exist _e
        should.exist _e.VERSION


    describe "API", ->

        it ".eventize() exist" , -> _e.eventize.should.be.a.Function
        it ".topic() exist"    , -> _e.topic.should.be.a.Function
        it ".slot() exist"     , -> _e.slot.should.be.a.Function


    describe "_e.eventize( obj )", ->

        obj    = {}
        resObj = _e.eventize( obj )

        it "should return obj" , -> resObj.should.be.equal obj
        it "obj.on() exist"    , -> obj.on.should.be.a.Function
        it "obj.emit() exist"  , -> obj.emit.should.be.a.Function

