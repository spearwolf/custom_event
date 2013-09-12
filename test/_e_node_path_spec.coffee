should = require 'should'
_e = require "./../src/custom_event"
NodePath = _e.NodePath

describe "NodePath API", ->

    describe "absolute path", ->

        describe "new NodePath(absolutePath)", ->

            path = new NodePath '/foo/bar'

            it "path property", -> path.should.have.property 'path', '/foo/bar'
            it "toString() returns path", -> path.path.should.equal path.toString()
            it "isAbsolute is true", -> path.should.have.property 'isAbsolute', true
            it "pathItems() returns ['foo', 'bar']", -> path.pathItems().should.eql ['foo', 'bar']


        describe "new NodePath(absolutePath, node)", ->

            path = new NodePath '/foo/bar', _e.rootNode

            it "ignores node param", -> should.not.exists path.node
            it "path property", -> path.should.have.property 'path', '/foo/bar'
            it "isAbsolute is true", -> path.should.have.property 'isAbsolute', true


        describe "new NodePath(relativePath)", ->

            path = new NodePath 'foo/bar'

            it "path property is ('/' + relativePath)", -> path.should.have.property 'path', '/foo/bar'
            it "isAbsolute is true", -> path.should.have.property 'isAbsolute', true
            it "pathItems() returns ['foo', 'bar']", -> path.pathItems().should.eql ['foo', 'bar']


        describe "new NodePath(undefined)", ->
            path = new NodePath()
            it "path property is '/'", -> path.should.have.property 'path', '/'
            it "isAbsolute is true", -> path.should.have.property 'isAbsolute', true
            it "pathItems() returns []", -> path.pathItems().should.eql []

        describe "new NodePath(null)", ->
            path = new NodePath(null)
            it "path property is '/'", -> path.should.have.property 'path', '/'
            it "isAbsolute is true", -> path.should.have.property 'isAbsolute', true

        describe "new NodePath('')", ->
            path = new NodePath('')
            it "path property is '/'", -> path.should.have.property 'path', '/'
            it "isAbsolute is true", -> path.should.have.property 'isAbsolute', true

        describe "new NodePath('/')", ->
            path = new NodePath('/')
            it "path property is '/'", -> path.should.have.property 'path', '/'
            it "isAbsolute is true", -> path.should.have.property 'isAbsolute', true



    describe 'relative path', ->

        a = _e.rootNode.addChild('nodepath_rel').addChild('a')

        describe "new NodePath(relativePath, node)", ->
            path = new NodePath 'b/c', a
            it "path property", -> path.should.have.property 'path', 'b/c'
            it "isAbsolute is false", -> path.should.have.property 'isAbsolute', false
            it "node available", -> path.should.have.property 'node', a
            it "pathItems() returns ['b', 'c']", -> path.pathItems().should.eql ['b', 'c']
            it "absolutePath()", -> path.absolutePath().toString().should.equal '/nodepath_rel/a/b/c'

        describe "new NodePath('', node)", ->
            path = new NodePath '', a
            it "path property", -> path.should.have.property 'path', ''
            it "isAbsolute is false", -> path.should.have.property 'isAbsolute', false
            it "node available", -> path.should.have.property 'node', a
            it "pathItems() returns []", -> path.pathItems().should.eql []
            it "absolutePath()", -> path.absolutePath().toString().should.equal '/nodepath_rel/a'

        describe "new NodePath(null, node)", ->
            path = new NodePath null, a
            it "path property", -> path.should.have.property 'path', ''
            it "isAbsolute is false", -> path.should.have.property 'isAbsolute', false
            it "node available", -> path.should.have.property 'node', a


    describe "absolutePath()", ->

        a = _e.rootNode.addChild('nodepath_abs').addChild('a')

        it 'from absolute path', ->

            a.path.absolutePath().toString().should.equal '/nodepath_abs/a'

        it 'from relative path', ->

            path = new NodePath 'b/c', a
            path.absolutePath().toString().should.equal '/nodepath_abs/a/b/c'


