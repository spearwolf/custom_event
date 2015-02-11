should = require 'should'
_e     = require "./../custom_event"

describe "emit( .. )", ->

    obj  = _e.eventize {}
    foo  = 0
    bar  = 0
    plah = 0

    co0 = obj.on "foo", (arg) -> foo += arg
    co1 = obj.on "bar", (arg) -> bar += arg
    co2 = obj.on "foo", (arg) -> plah += arg


    it "should invoke all receivers", ->

        obj.emit "foo", 1

        foo.should.be.equal 1
        bar.should.be.equal 0
        plah.should.be.equal 1

        obj.emit "bar", 2

        foo.should.be.equal 1
        bar.should.be.equal 2
        plah.should.be.equal 1


    #it "should NOT invoke receivers when their connection is paused", ->

        #co0.pause = true

        #obj.emit "foo", 1

        #foo.should.be.equal 1
        #bar.should.be.equal 2
        #plah.should.be.equal 2

        #co0.pause = false
        #co2.pause = true

        #obj.emit "foo", 2

        #foo.should.be.equal 3
        #bar.should.be.equal 2
        #plah.should.be.equal 2

        #co2.pause = false


    #it "should NOT invoke receivers when their connection is destroyed", ->

        #co2.destroy()

        #obj.emit "foo", 1

        #foo.should.be.equal 4
        #bar.should.be.equal 2
        #plah.should.be.equal 2


        #co0.destroy()

        #obj.emit "foo", 2

        #foo.should.be.equal 4
        #bar.should.be.equal 2
        #plah.should.be.equal 2

