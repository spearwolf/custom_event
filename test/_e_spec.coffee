should = require 'should'
_e     = require "./../custom_event"

describe "_e", ->

    it "should exist and has a VERSION property", ->

        should.exist _e
        should.exist _e.VERSION


    describe "API", ->

        it "eventize()" , -> _e.eventize.should.be.a.Function
        it "topic()"    , -> _e.topic.should.be.a.Function
        it "slot()"     , -> _e.slot.should.be.a.Function


