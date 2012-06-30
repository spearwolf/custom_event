should = require 'should'
_e = require "./../custom_event"

describe "_e", ->

    it "should be defined with all public api functions", ->

        should.exist _e
        should.exist _e.VERSION

        _e.on.should.be.a "function"
        _e.idle.should.be.a "function"
        _e.once.should.be.a "function"
        _e.emit.should.be.a "function"
        _e.collect.should.be.a "function"
        _e.connect.should.be.a "function"
        _e.destroy.should.be.a "function"

        _e.val.should.be.a "function"
        _e.get.should.be.a "function"
        _e.set.should.be.a "function"

