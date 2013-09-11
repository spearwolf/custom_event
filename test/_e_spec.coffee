should = require 'should'
_e = require "./../src/custom_event"

describe "_e", ->

    it "should exist and define the VERSION", ->
        should.exist _e
        should.exist _e.VERSION

    #describe "API", ->
        #it "on()", -> _e.on.should.be.a "function"
        #it "idle()", -> _e.idle.should.be.a "function"
        #it "once()", -> _e.once.should.be.a "function"
        #it "emit()", -> _e.emit.should.be.a "function"
        #it "collect()", -> _e.collect.should.be.a "function"
        #it "connect()", -> _e.connect.should.be.a "function"
        #it "destroy()", -> _e.destroy.should.be.a "function"
        #it "destroy_all()", -> _e.destroy_all.should.be.a "function"
        #it "val()", -> _e.val.should.be.a "function"
        #it "get()", -> _e.get.should.be.a "function"
        #it "set()", -> _e.set.should.be.a "function"
        #it "pause()", -> _e.pause.should.be.a "function"

