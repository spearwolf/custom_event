should = require 'should'
_e = require "./../src/custom_event"
node = _e.rootNode

describe "CustomEventNode API", ->

    it "node.type is 'CustomEventNode'", -> node.type.should.equal 'CustomEventNode'
    it "node.findOrCreate(path)", -> node.findOrCreate.should.be.a 'function'
    
    child = node.addChild 'foo'

    describe "addChild(nodeName)", ->

        it "exists", -> node.addChild.should.be.a 'function'

        it "create a CustomEventNode", ->
            child.should.be.a 'object'
            child.should.have.property 'type', 'CustomEventNode'

        grand_child = child.addChild 'bar'

        it "nodeName available", ->
            child.should.have.property 'nodeName', 'foo'
            grand_child.should.have.property 'nodeName', 'bar'

        it "parentNode available", ->
            child.should.have.property 'parentNode', node
            grand_child.should.have.property 'parentNode', child

        it "rootNode available", ->
            child.should.have.property 'rootNode', _e.rootNode
            grand_child.should.have.property 'rootNode', _e.rootNode

        it "isRootNode is false", ->
            child.isRootNode.should.be.false
            grand_child.isRootNode.should.be.false

        it "throws exception if child with nodeName exists", ->
            (-> node.addChild 'foo').should.throw()
            (-> child.addChild 'bar').should.throw()

        it "path", ->
            child.should.have.property 'path'
            child.path.toString().should.equal '/foo'
            grand_child.should.have.property 'path'
            grand_child.path.toString().should.equal '/foo/bar'

        it "node.path is always an absolute path", ->
            child.path.isAbsolute.should.be.true
            grand_child.path.isAbsolute.should.be.true


    describe "getChild(nodeName)", ->

        it "exists", -> node.getChild.should.be.a 'function'

        it 'returns childNode', ->
            foo = node.getChild 'foo'
            should.exist foo
            foo.should.be.a 'object'
            foo.should.have.ownProperty 'type', 'CustomEventNode'

        it 'returns undefined if child not found', ->
            should.not.exist node.getChild('bar')


    describe "findOrCreate(path)", ->

        it "should find (and create new nodes on the fly) node from path", ->

            should.not.exist node.getChild('findOrCreate')

            node.findOrCreate 'findOrCreate'

            a = node.getChild 'findOrCreate'
            should.exist a

            node.findOrCreate '/findOrCreate/b'

            b = a.getChild 'b'
            should.exist b

            abc_child = a.findOrCreate '/findOrCreate/b/c'

            c = b.getChild 'c'
            should.exist c


    describe "find(path)", ->

        it "should find node from path or undefined if not found", ->

            node.findOrCreate 'find/a/b/c/d/e/f/g/h/i'

            c = node.find 'find/a/b/c'
            should.exist c
            c.nodeName.should.equal 'c'

            e = c.find '/find/a/b/c/d/e'
            should.exist e
            e.nodeName.should.equal 'e'

            i = e.find 'f/g/h/i'
            should.exist i
            i.nodeName.should.equal 'i'

            should.not.exist e.find '/find2/g/u/z'
            should.not.exist c.find 'g/u/z'

            root = e.find '/'
            should.exist root
            root.isRootNode.should.be.true


    describe "match(path)", ->

        it "should find best matching node from path and returns restPathItems", ->

            node.findOrCreate 'match/a/b/c'

            match = node.match '/match/a/x/y'
            should.exist match
            match.should.have.property 'node'
            match.node.should.have.property 'nodeName', 'a'
            match.should.have.property 'restPathItems'
            match.restPathItems.should.eql ['x', 'y']

            match = node.match '/match2/a/x/y'
            should.exist match
            match.should.have.property 'node'
            match.node.isRootNode.should.be.true
            match.should.have.property 'restPathItems'
            match.restPathItems.should.eql ['match2', 'a', 'x', 'y']

            match = node.match '/match/a/b/c'
            should.exist match
            match.should.have.property 'node'
            match.node.should.have.property 'nodeName', 'c'
            match.should.have.ownProperty 'restPathItems'
            should.not.exist match.restPathItems

            match = node.match '/'
            should.exist match
            match.should.have.property 'node'
            match.node.isRootNode.should.be.true
            match.should.have.ownProperty 'restPathItems'
            should.not.exist match.restPathItems

    # TODO deepMatch(path)


