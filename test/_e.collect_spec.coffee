should = require 'should'
_e = require "./../custom_event"

describe "_e.collect", ->

    it "should collect all results from a topic", ->

        TOPIC = "gaia/foo"

        _e.on TOPIC, -> 1
        _e.on TOPIC, -> 2
        _e.on TOPIC, -> 3
        _e.on TOPIC, -> undefined
        _e.on TOPIC, -> false

        _e.collect TOPIC, (a, b, c, d, e) ->
            a.should.equal 1
            b.should.equal 2
            c.should.equal 3
            d.should.equal false
            should.not.exist e


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


    it "should collect all results from a double-wildcarded topic", ->

        _e.on "hades/a", -> 21
        _e.on "hades/b", -> 22
        _e.on "hades/c", -> null
        _e.on "hades/b/c", -> 23
        _e.on "hades/b/c/dd", -> 24

        _e.collect "hades/**", (a, b, c, d, e) ->
            a.should.equal 21
            b.should.equal 22
            c.should.equal 23
            d.should.equal 24
            should.not.exist e

