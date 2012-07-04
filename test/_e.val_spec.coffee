should = require 'should'
_e = require "./../custom_event"

#_e.options.trace = yes

describe "_e.val(<topic>)", ->

    a = _e.val "c/b/a"

    it "should return a function ..", ->

        should.exist a
        a.should.be.a "function"

    it ".. which return 'ValueFunction' as eType", -> a.eType.should.equal "ValueFunction"
    it ".. which has a .get() function", -> a.get.should.be.a "function"
    it ".. which has a .set() function", -> a.set.should.be.a "function"
    it ".. which has a .on() function", -> a.on.should.be.a "function"
    it ".. which has a .isEqual() function", -> a.isEqual.should.be.a "function"
    it ".. which has a .isDefined() function", -> a.isDefined.should.be.a "function"


describe "_e.val(<topic>).on(<function>)", ->

    it "should immediately call on(change) callbacks when value is updated", ->

        higgs = _e.val "ff/hhh"

        x = 10
        y = 10

        higgs.on (val) -> x += val
        higgs.on (val) -> y += val + 2

        x.should.be.equal 10
        y.should.be.equal 10

        higgs.set(30)

        x.should.be.equal 40
        y.should.be.equal 42

        higgs.set(15)

        x.should.be.equal 55
        y.should.be.equal 59


describe "_e.val(<topic>).set(<value>)", ->

    plah = _e.val "goa/plah"

    it "should update the value", ->
        plah.set(33)
        plah().should.be.equal 33

    it "should return the (new) value", ->
        plah.set(38).should.be.equal 38


describe "_e.val(<topic>).get()", ->

    plah = _e.val "foo/plah"

    it "should immediately return undefined as value if not initialized", ->
        should.not.exist plah.get()

    it "should immediately return the value", ->
        plah.set(11)
        plah.get().should.equal 11


describe "_e.val(<topic>).get(<function>)", ->

    it "should call getter functions only *after* value is initialized", ->

        bar = _e.val "foo/bar"

        x = undefined
        y = undefined

        bar.get (val) -> x = val
        bar.get (val) -> y = val + 1

        should.not.exist x
        should.not.exist y

        bar.set(42)

        x.should.be.equal 42
        y.should.be.equal 43

    it "should immediately call getter functions when value is already initialized", ->

        higgs = _e.val "fff/ggg"
        higgs.set(55)

        x = undefined
        y = undefined

        higgs.get (val) -> x = val
        higgs.get (val) -> y = val + 1

        x.should.be.equal 55
        y.should.be.equal 56


describe "_e.val(<topic>)()", ->

    plah = _e.val "abc/plah"

    it "should be a shortcut for _e.val(<topic>).get()", ->
        plah.set(13)
        plah.get().should.equal 13
        plah().should.equal 13


describe "_e.val(<topic>)(<value>)", ->

    plah = _e.val "gf2oa/ps12lah"

    it "should be a shortcut for _e.val(<topic>).set(<value>)", ->
        plah('hello').should.be.equal "hello"
        plah().should.be.equal "hello"


describe "_e.val(<topic>)(<function>)", ->

    plah = _e.val "akjsyfg2u.abc/plah"

    it "should set value and *NOT* be a shortcut for _e.val(<topic>).get(<callback>)", ->

        should.not.exist plah()

        x = 1
        y = 1

        plah (_x) -> x += _x
        plah.on (_y) -> y += _y

        plah().should.be.a "function"
        x.should.equal 1
        y.should.equal 1

        plah.set(2)

        plah().should.equal 2
        x.should.equal 1
        y.should.equal 3

        plah.set(3)

        plah().should.equal 3
        x.should.equal 1
        y.should.equal 6


