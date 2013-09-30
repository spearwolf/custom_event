should = require 'should'
_e = require "./../src/custom_event"

describe "_e", ->

    it "exists", ->
        should.exist _e

    it "VERSION available", ->
        should.exist _e.VERSION

    describe "public API", ->

        it "NodePath constructor", -> _e.NodePath.should.be.a "function"

        it "on()", -> _e.on.should.be.a "function"
        #it "idle()", -> _e.idle.should.be.a "function"
        #it "once()", -> _e.once.should.be.a "function"
        it "emit()", -> _e.emit.should.be.a "function"
        #it "collect()", -> _e.collect.should.be.a "function"
        #it "connect()", -> _e.connect.should.be.a "function"
        #it "destroy()", -> _e.destroy.should.be.a "function"
        #it "destroy_all()", -> _e.destroy_all.should.be.a "function"
        #it "val()", -> _e.val.should.be.a "function"
        #it "get()", -> _e.get.should.be.a "function"
        #it "set()", -> _e.set.should.be.a "function"
        #it "pause()", -> _e.pause.should.be.a "function"

    describe "rootNode", ->

        it "exists", -> _e.rootNode.should.be.a "function"

        it "isRootNode is true", -> _e.rootNode.isRootNode.should.be.true

        it "nodeName exists but is undefined", ->
            _e.rootNode.should.have.ownProperty 'nodeName'
            should.not.exist _e.rootNode.nodeName

        it "parentNode exists but is undefined", ->
            _e.rootNode.should.have.ownProperty 'parentNode'
            should.not.exist _e.rootNode.parentNode

        it "path exists but is undefined", ->
            _e.rootNode.should.have.ownProperty 'path'
            should.not.exist _e.rootNode.path


    describe "log API", ->
        it "exists", -> _e.log.should.be.a "object"
        it "log.error()", -> _e.log.error.should.be.a 'function'
        it "log.debug()", -> _e.log.debug.should.be.a 'function'
        it "log.trace()", -> _e.log.trace.should.be.a 'function'
        it "log.debugGroup()", -> _e.log.debugGroup.should.be.a 'function'
        it "log.debugGroupEnd()", -> _e.log.debugGroupEnd.should.be.a 'function'
        it "log.traceGroup()", -> _e.log.traceGroup.should.be.a 'function'
        it "log.traceGroupEnd()", -> _e.log.traceGroupEnd.should.be.a 'function'


