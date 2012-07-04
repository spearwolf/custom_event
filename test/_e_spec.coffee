should = require 'should'
_e = require "./../custom_event"

describe "_e", ->

    it "should exist and define a VERSION attribute", ->
        should.exist _e
        should.exist _e.VERSION

    it "should define a .on() function", -> _e.on.should.be.a "function"
    it "should define a .idle() function", -> _e.idle.should.be.a "function"
    it "should define a .once() function", -> _e.once.should.be.a "function"
    it "should define a .emit() function", -> _e.emit.should.be.a "function"
    it "should define a .collect() function", -> _e.collect.should.be.a "function"
    it "should define a .connect() function", -> _e.connect.should.be.a "function"
    it "should define a .destroy() function", -> _e.destroy.should.be.a "function"
    it "should define a .val() function", -> _e.val.should.be.a "function"
    it "should define a .get() function", -> _e.get.should.be.a "function"
    it "should define a .set() function", -> _e.set.should.be.a "function"

