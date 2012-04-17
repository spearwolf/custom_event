should = require 'should'
_e = require "./../custom_event"

describe "_e.collect", ->

    it "should collect all results from a topic", ->

        topic = "gaia/foo"

        _e.on topic, -> 1
        _e.on topic, -> 2
        _e.on topic, -> 3
        _e.on topic, -> undefined

        _e.collect topic, (a, b, c, d) ->
            a.should.equal 1
            b.should.equal 2
            c.should.equal 3
            should.not.exist d


    it "should collect all results from a wildcard topic", ->

        _e.on "zeus/a", -> 11
        _e.on "zeus/b", -> 12
        _e.on "zeus/c", -> null
        _e.on "zeus/b/c", -> 13

        _e.collect "zeus/*", (a, b, c, d) ->
            a.should.equal 11
            b.should.equal 12
            should.not.exist c
            should.not.exist d


